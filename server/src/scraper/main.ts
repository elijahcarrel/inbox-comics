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
  console.log("Scraped ", syndication.identifier, " from site with id ", syndication.site_id, " and got ", scrapeResult);
  return scrapeResult;
};

export const scrapeComic = async (syndication: ISyndication, date: Moment): Promise<ScrapeResult> => {
  const { site_id: siteId, theiridentifier: theirIdentifier } = syndication;
  switch (siteId) {
    case sites.gocomics.id: {
      const uri = `http://www.gocomics.com/${theirIdentifier}/${date.format("YYYY/MM/DD")}`;
      const $ = await cheerioRequest(uri);
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
  date: string;
  imageUrl: string;
  success: boolean;
  failureMode: FailureMode | null;
}

const comicSchema = new Schema({
  syndication: {
    type: Schema.Types.ObjectId,
    ref: "syndication",
  }!,
  date: String!,
  imageUrl: String!,
  success: Boolean!,
  failureMode: String,
}, { timestamps: true });

export const Comic = model<IComic>("comic", comicSchema);

const createComicDbObject = (syndication: ISyndication, date: Moment, scrapeResult: ScrapeResult) => {
  const { success, imageUrl, failureMode } = scrapeResult;
  return { syndication, date: date.format("YYYY-MM-DD"), imageUrl, success, failureMode };
};

export const scrapeAndSaveComic = async (syndication: ISyndication, date: Moment) => {
  const scrapeResult = await scrapeComicAndLog(syndication, date);
  await Comic.create(createComicDbObject(syndication, date, scrapeResult));
};

export const scrapeAndSaveAllComics = async (date: Moment) => {
  // TODO(ecarrel): right now this doesn't work.
  const syndications = await Syndication.find({}).exec();
  const scrapeResults = await Promise.all(
    syndications.map((syndication: ISyndication) => scrapeComicAndLog(syndication, date),
  ));
  const augmentedScrapeResults = scrapeResults.map((scrapeResult, i) => ({
    syndication: syndications[i],
    scrapeResult,
  }));
  const comics = augmentedScrapeResults
    .map(({ syndication, scrapeResult }) => createComicDbObject(syndication, date, scrapeResult));
  if (comics.length > 0) {
    await Comic.create(comics);
  }
};
