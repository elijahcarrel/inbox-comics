import btoa from "btoa";
import cheerio from "cheerio";
import { Moment } from "moment-timezone";
import { Document, model, Schema } from "mongoose";
import requestPromise from "request-promise";
import { ISyndication, Syndication } from "../syndication";

const sites = {
  gocomics: {
    name: "GOCOMICS",
    description: "GoComics",
    id: 0,
  },
  comicskingdom: {
    name: "COMICS_KINGDOM",
    description: "Comics Kingdom",
    id: 1,
  },
};

type FailureMode = "UNKNOWN" | "GOCOMICS_REJECTION" | "UNKNOWN_SITE" | "MISSING_COMICS_KINGDOM_DATA" | null;

const failureModes: { [key: string]: FailureMode } = {
  UNKNOWN: "UNKNOWN",
  GOCOMICS_REJECTION: "GOCOMICS_REJECTION",
  UNKNOWN_SITE: "UNKNOWN_SITE",
  MISSING_COMICS_KINGDOM_DATA: "MISSING_COMICS_KINGDOM_DATA",
};

interface ScrapeResult {
  success: boolean;
  imageUrl: string | null;
  failureMode: FailureMode;
}

const standardFailure = (failureMode: FailureMode): ScrapeResult => ({
  success: false,
  imageUrl: null,
  failureMode,
});

const processImageUrl = (imageUrl: string | null): ScrapeResult => {
  if (imageUrl == null || imageUrl.length === 0) {
    return standardFailure(failureModes.UNKNOWN);
  } else {
    return {
      success: true,
      imageUrl,
      failureMode: null,
    };
  }
};

const cheerioRequest = async (uri: string) => {
  return requestPromise({
    uri,
    transform: (body: string) => cheerio.load(body),
  });
};

const scrapeComicAndLog = async (syndication: ISyndication, date: Moment): Promise<ScrapeResult> => {
  const scrapeResult = await scrapeComic(syndication, date);
  // tslint:disable-next-line no-console
  console.log(
    "Scraped ", syndication.identifier,
    " from site with id ", syndication.site_id,
    " and got ", scrapeResult,
  );
  return scrapeResult;
};

export const scrapeComic = async (syndication: ISyndication, date: Moment): Promise<ScrapeResult> => {
  const { site_id: siteId, theiridentifier: theirIdentifier } = syndication;
  switch (siteId) {
    case sites.gocomics.id: {
      const uri = `http://www.gocomics.com/${theirIdentifier}/${date.format("YYYY/MM/DD")}`;
      // TODO(ecarrel): this is an ugly code pattern...
      let $ = null;
      try {
        $ = await cheerioRequest(uri);
      } catch(err) {
        return standardFailure(failureModes.GOCOMICS_REJECTION);
      }
      const comicImages = $("picture.item-comic-image img");
      if (comicImages.length !== 1) {
        return standardFailure(failureModes.UNKNOWN);
      }
      return processImageUrl(comicImages.attr("src"));
    }
    case sites.comicskingdom.id: {
      const { comicskingdomdir: dir, comicskingdomfileprefix: filePrefix } = syndication;
      if (dir == null || filePrefix == null) {
        return standardFailure(failureModes.MISSING_COMICS_KINGDOM_DATA);
      }
      // tslint:disable-next-line max-line-length
      const imageUrlChunk = `${dir}/${date.format("YYYY/MM")}/${filePrefix}_qs.${date.format("YYYYMMDD")}_1536.png`;
      const imageUrl = `https://safr.kingfeatures.com/api/img.php?e=png&s=c&file=${btoa(imageUrlChunk)}`;
      // TODO(ecarrel): verify that the image does not return an empty response.
      return processImageUrl(imageUrl);
    }
    default:
      return standardFailure(failureModes.UNKNOWN_SITE);
  }
};

export interface IComic extends Document {
  syndication: ISyndication;
  date: Date;
  imageUrl: string;
  success: boolean;
  failureMode: FailureMode | null;
}

const comicSchema = new Schema({
  syndication: {
    type: Schema.Types.ObjectId,
    ref: "syndication",
  }!,
  date: Date!,
  imageUrl: String!,
  success: Boolean!,
  failureMode: String,
}, { timestamps: true });

export const Comic = model<IComic>("comic", comicSchema);

const createComicDbObject = (syndication: ISyndication, date: Moment, scrapeResult: ScrapeResult) => {
  const { success, imageUrl, failureMode } = scrapeResult;
  return { syndication, date: date.toDate(), imageUrl, success, failureMode };
};

// TODO(ecarrel): dedupe code that exists here and in scrapeAndSaveAllComics.
export const scrapeAndSaveComic = async (syndication: ISyndication, date: Moment) => {
  const scrapeResult = await scrapeComicAndLog(syndication, date);
  const createdComic = await Comic.create(createComicDbObject(syndication, date, scrapeResult));
  syndication.lastAttemptedComicScrapeDate = date.toDate();
  if (scrapeResult.success) {
    syndication.lastSuccessfulComicScrapeDate = date.toDate();
    syndication.lastSuccessfulComic = createdComic;
  }
  await syndication.save();
};

export const scrapeAndSaveAllComics = async (date: Moment, limit: number | null = 50) => {
  let syndicationsRequest = Syndication.find({}).sort({ lastAttemptedComicScrapeDate: 1 });
  if (limit != null) {
    syndicationsRequest = syndicationsRequest.limit(limit);
  }
  const syndications = await syndicationsRequest.exec();
  const scrapeResults = await Promise.all(
    syndications.map((syndication: ISyndication) => scrapeComicAndLog(syndication, date),
  ));
  const augmentedScrapeResults = scrapeResults.map((scrapeResult, i) => ({
    syndication: syndications[i],
    scrapeResult,
  }));
  const comics = augmentedScrapeResults
    .map(({ syndication, scrapeResult }) => createComicDbObject(syndication, date, scrapeResult));
  let createdComics: IComic[] = [];
  if (comics.length > 0) {
    createdComics = await Comic.create(comics);
  }
  const updatedSyndications = augmentedScrapeResults
    .map(({ syndication, scrapeResult }) => {
      syndication.lastAttemptedComicScrapeDate = date.toDate();
      if (scrapeResult.success) {
        syndication.lastSuccessfulComicScrapeDate = date.toDate();
        // TODO(ecarrel): there's gotta be a better way to do this.
        const createdComic = createdComics.find(
          (comic: IComic) => comic.syndication.identifier === syndication.identifier,
        );
        if (createdComic != null) {
          syndication.lastSuccessfulComic = createdComic;
        }
      }
      return syndication;
    });
  if (updatedSyndications.length > 0) {
    // TODO(ecarrel): batch this.
    await Promise.all(updatedSyndications.map(
      (updatedSyndication) => updatedSyndication.save(),
    ));
  }
};
