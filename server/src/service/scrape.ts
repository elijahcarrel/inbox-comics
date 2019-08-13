import axios from "axios";
import cheerio from "cheerio";
import { Moment } from "moment-timezone";
// @ts-ignore
import unescape from "unescape";
import { Comic, ComicFailureMode, failureModes, IComic } from "../models/comic";
import { ISyndication, Syndication } from "../models/syndication";
import { ScrapeAndSaveAllComicsOptions } from "../router/scrape";

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
  arcamax: {
    name: "ARCAMAX",
    description: "ArcaMax",
    id: 2,
  },
  xkcd: {
    name: "XKCD",
    description: "xkcd",
    id: 4,
  },
};

interface ScrapeResult {
  success: boolean;
  imageUrl: string | null;
  failureMode: ComicFailureMode | null;
  imageCaption: string | null;
}

const scrapeFailure = (failureMode: ComicFailureMode): ScrapeResult => ({
  success: false,
  imageUrl: null,
  failureMode,
  imageCaption: null,
});

const scrapeSuccess = (imageUrl: string | null, imageCaption?: string | null): ScrapeResult => {
  if (imageUrl == null || imageUrl.length === 0) {
    return scrapeFailure(failureModes.UNKNOWN);
  } else {
    return {
      success: true,
      imageUrl,
      failureMode: null,
      imageCaption: imageCaption || null,
    };
  }
};

const cheerioRequest = async (url: string) => {
  const response = await axios({
    method: "GET",
    url,
    responseType: "text",
  });
  return cheerio.load(response.data);
};

export const scrapeComic = async (syndication: ISyndication, date: Moment): Promise<ScrapeResult> => {
  const { site_id: siteId, theiridentifier: theirIdentifier } = syndication;
  switch (siteId) {
    case sites.gocomics.id: {
      const url = `http://www.gocomics.com/${theirIdentifier}/${date.format("YYYY/MM/DD")}`;
      // TODO(ecarrel): this is an ugly code pattern...
      let $ = null;
      try {
        $ = await cheerioRequest(url);
      } catch (err) {
        return scrapeFailure(failureModes.GOCOMICS_REJECTION);
      }
      const comicImages = $("picture.item-comic-image img");
      if (comicImages.length !== 1) {
        return scrapeFailure(failureModes.GOCOMICS_MISSING_IMAGE_ON_PAGE);
      }
      return scrapeSuccess(comicImages.attr("src"));
    }
    case sites.comicskingdom.id: {
      const url = `https://www.comicskingdom.com/${theirIdentifier}/${date.format("YYYY-MM-DD")}`;
      // TODO(ecarrel): this is an ugly code pattern...
      let $ = null;
      try {
        $ = await cheerioRequest(url);
      } catch (err) {
        return scrapeFailure(failureModes.COMICS_KINGDOM_REJECTION);
      }
      const comicImages = $("meta[property='og:image']");
      if (comicImages.length !== 1) {
        return scrapeFailure(failureModes.COMICS_KINGDOM_MISSING_IMAGE_ON_PAGE);
      }
      return scrapeSuccess(comicImages.attr("content"));
    }
    case sites.arcamax.id: {
      const url = `https://www.arcamax.com/thefunnies/${theirIdentifier}/`;
      // TODO(ecarrel): this is an ugly code pattern...
      let $ = null;
      try {
        $ = await cheerioRequest(url);
      } catch (err) {
        return scrapeFailure(failureModes.ARCAMAX_REJECTION);
      }
      const comicImages = $("img#comic-zoom");
      if (comicImages.length !== 1) {
        return scrapeFailure(failureModes.ARCAMAX_MISSING_IMAGE_ON_PAGE);
      }
      const imageUrl = comicImages.attr("src");
      return scrapeSuccess(`https://www.arcamax.com${imageUrl}`);
    }
    case sites.xkcd.id: {
      const url = `https://xkcd.com/rss.xml`;
      let $ = null;
      try {
        $ = await cheerioRequest(url);
      } catch (err) {
        return scrapeFailure(failureModes.XKCD_RSS_REJECTION);
      }
      const items = $("rss channel item");
      if (items.length === 0) {
        return scrapeFailure(failureModes.XKCD_PARSE_ERROR);
      }
      const firstItemDescriptions = items.first().find("description");
      if (firstItemDescriptions.length === 0) {
        return scrapeFailure(failureModes.XKCD_PARSE_ERROR);
      }
      const firstItemDescription = unescape(firstItemDescriptions.first().html());
      const $$ = cheerio.load(firstItemDescription);
      const comicImages = $$("img");
      if (comicImages.length !== 1) {
        return scrapeFailure(failureModes.XKCD_PARSE_ERROR);
      }
      return scrapeSuccess(comicImages.attr("src"), comicImages.attr("alt"));
    }
    default: {
      return scrapeFailure(failureModes.UNKNOWN_SITE);
    }
  }
};

const createComicDbObject = (syndication: ISyndication, date: Moment, scrapeResult: ScrapeResult) => {
  const { success, imageUrl, failureMode, imageCaption } = scrapeResult;
  return { syndication, date: date.toDate(), imageUrl, imageCaption, success, failureMode };
};

// TODO(ecarrel): dedupe code that exists here and in scrapeAndSaveAllComics.
export const scrapeAndSaveComic = async (syndication: ISyndication, date: Moment) => {
  const scrapeResult = await scrapeComic(syndication, date);
  const createdComic = await Comic.create(createComicDbObject(syndication, date, scrapeResult));
  syndication.lastAttemptedComicScrapeDate = date.toDate();
  if (scrapeResult.success) {
    syndication.lastSuccessfulComicScrapeDate = date.toDate();
    syndication.lastSuccessfulComic = createdComic;
  }
  await syndication.save();
};

export const scrapeAndSaveAllComics = async (date: Moment, options: ScrapeAndSaveAllComicsOptions = {}) => {
  const {
    siteId,
    limit = 50,
    dontRescrapeSyndicationThatSucceededEarlierToday = true,
    dontRetryInLessThanAnHour = true,
  } = options;
  let conditions: object = {};
  if (siteId) {
    conditions = {
      ...conditions,
      site_id: siteId,
    };
  }
  if (dontRescrapeSyndicationThatSucceededEarlierToday) {
    conditions = {
      ...conditions,
      lastSuccessfulComicScrapeDate: { $lt: date.startOf("day").toDate() },
    };
  }
  if (dontRetryInLessThanAnHour) {
    conditions = {
      ...conditions,
      lastAttemptedComicScrapeDate: { $lt: date.subtract(1, "hour").toDate() },
    };
  }
  let syndicationsRequest = Syndication.find(conditions).sort({
    // Order by last attempted scrape date in ascending order (that is, we start with the ones
    // that were last attempted the longest ago).
    lastAttemptedComicScrapeDate: 1,
  });
  if (limit !== 0) {
    syndicationsRequest = syndicationsRequest.limit(limit);
  }
  const syndications = await syndicationsRequest.exec();
  const scrapeResults = await Promise.all(
    syndications.map((syndication: ISyndication) => scrapeComic(syndication, date),
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
