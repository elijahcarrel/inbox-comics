import axios from "axios";
import cheerio from "cheerio";
import { Moment } from "moment-timezone";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import unescape from "unescape";
import https from "https";
import {
  Comic,
  ComicFailureMode,
  failureModes,
  IComic,
  ISyndication,
  Syndication,
} from "../db-models/comic-syndication";
import { ScrapeAndSaveAllComicsOptions } from "../api-models/scrape-options";

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
  tundra: {
    name: "Tundra",
    description: "Tundra",
    id: 3,
  },
  xkcd: {
    name: "XKCD",
    description: "xkcd",
    id: 4,
  },
  phdcomics: {
    name: "PHDCOMICS",
    description: "PhD Comics",
    id: 5,
  },
  explosm: {
    name: "EXPLOSM",
    description: "Explosm",
    id: 6,
  },
  arcamaxeditorials: {
    name: "ARCAMAX_EDITORIALS",
    description: "ArcaMax Editorials",
    id: 7,
  },
  dinosaur: {
    name: "DINOSAUR",
    description: "Dinosaur",
    id: 8,
  },
  // TODO(ecarrel): delete SMBC? It's unnecessary since we already get it from gocomics.
  smbc: {
    name: "SMBC",
    description: "Saturday Morning Breakfast Cereal",
    id: 9,
  },
  threewordphrase: {
    name: "THREE_WORD_PHRASE",
    description: "Three Word Phrase",
    id: 10,
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

const scrapeSuccess = (
  imageUrl: string | undefined,
  imageCaption?: string | null,
): ScrapeResult => {
  if (imageUrl == null || imageUrl.length === 0) {
    return scrapeFailure(failureModes.UNKNOWN);
  }
  return {
    success: true,
    imageUrl,
    failureMode: null,
    imageCaption: imageCaption || null,
  };
};

const cheerioRequest = async (url: string) => {
  try {
    const response = await axios({
      method: "GET",
      url,
      responseType: "text",
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
    // TODO(ecarrel): check if response.request.res.responseUrl !== url to detect redirects.
    return cheerio.load(response.data);
  } catch (err) {
    return null;
  }
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-underscore-dangle,@typescript-eslint/no-unused-vars
const _producesNonEmptyResponse = async (url: string) => {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
  }).catch(() => false);
  if (typeof response === "boolean") {
    return false;
  }
  const content = response.data.read(1);
  return content != null;
};

const producesSuccessResponse = async (url: string) => {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
  }).catch(() => false);
  if (typeof response === "boolean") {
    return false;
  }
  return response.status === 200;
};

export const scrapeComic = async (
  syndication: ISyndication,
  date: Moment,
): Promise<ScrapeResult> => {
  const { site_id: siteId, theiridentifier: theirIdentifier } = syndication;
  switch (siteId) {
    case sites.gocomics.id: {
      const url = `http://www.gocomics.com/${theirIdentifier}/${date.format(
        "YYYY/MM/DD",
      )}`;
      const $ = await cheerioRequest(url);
      if ($ === null) {
        return scrapeFailure(failureModes.GOCOMICS_REJECTION);
      }
      const comicImages = $("picture.item-comic-image img");
      if (comicImages.length !== 1) {
        return scrapeFailure(failureModes.GOCOMICS_MISSING_IMAGE_ON_PAGE);
      }
      return scrapeSuccess(comicImages.attr("src"));
    }
    case sites.comicskingdom.id: {
      const url = `https://www.comicskingdom.com/${theirIdentifier}/${date.format(
        "YYYY-MM-DD",
      )}`;
      const $ = await cheerioRequest(url);
      if ($ === null) {
        return scrapeFailure(failureModes.COMICS_KINGDOM_REJECTION);
      }
      const comicImages = $("meta[property='og:image']");
      if (comicImages.length !== 1) {
        return scrapeFailure(failureModes.COMICS_KINGDOM_MISSING_IMAGE_ON_PAGE);
      }
      return scrapeSuccess(comicImages.attr("content"));
    }
    case sites.arcamax.id:
    case sites.arcamaxeditorials.id: {
      const directory =
        siteId === sites.arcamax.id
          ? "thefunnies"
          : "politics/editorialcartoons";
      const url = `https://www.arcamax.com/${directory}/${theirIdentifier}/`;
      const $ = await cheerioRequest(url);
      if ($ === null) {
        return scrapeFailure(failureModes.ARCAMAX_REJECTION);
      }
      const comicImages = $("img#comic-zoom");
      if (comicImages.length !== 1) {
        return scrapeFailure(failureModes.ARCAMAX_MISSING_IMAGE_ON_PAGE);
      }
      const imageUrl = comicImages.attr("src");
      return scrapeSuccess(`https://www.arcamax.com${imageUrl}`);
    }
    case sites.tundra.id: {
      const url = `http://www.tundracomicsftp.com/comicspub/daily_tundra/daily/${date.format(
        "YYYY-M-D",
      )}.jpg`;
      if (await producesSuccessResponse(url)) {
        return scrapeSuccess(url);
      }
      return scrapeFailure(failureModes.TUNDRA_IMAGE_404);
    }
    case sites.xkcd.id: {
      const url = `https://xkcd.com/rss.xml`;
      const $ = await cheerioRequest(url);
      if ($ === null) {
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
      const firstItemDescription = unescape(
        firstItemDescriptions.first().html(),
      );
      const $$ = cheerio.load(firstItemDescription);
      const comicImages = $$("img");
      if (comicImages.length !== 1) {
        return scrapeFailure(failureModes.XKCD_PARSE_ERROR);
      }
      return scrapeSuccess(comicImages.attr("src"), comicImages.attr("alt"));
    }
    // TODO(ecarrel): delete SMBC? It's unnecessary since we already get it from gocomics.
    case sites.smbc.id: {
      const url = `https://www.smbc-comics.com/comic/rss`;
      const $ = await cheerioRequest(url);
      if ($ === null) {
        return scrapeFailure(failureModes.SMBC_RSS_REJECTION);
      }
      const items = $("rss channel item");
      if (items.length === 0) {
        return scrapeFailure(failureModes.SMBC_PARSE_ERROR);
      }
      const firstItemDescriptions = items.first().find("description");
      if (firstItemDescriptions.length === 0) {
        return scrapeFailure(failureModes.SMBC_PARSE_ERROR);
      }
      const firstItemDescription = unescape(
        firstItemDescriptions.first().html(),
      );
      const $$ = cheerio.load(firstItemDescription);
      const comicImages = $$("img");
      if (comicImages.length !== 1) {
        return scrapeFailure(failureModes.SMBC_PARSE_ERROR);
      }
      // TODO(ecarrel): scrape hover text too.
      return scrapeSuccess(comicImages.attr("src"));
    }
    case sites.phdcomics.id: {
      const url = `http://phdcomics.com/gradfeed.php`;
      const $ = await cheerioRequest(url);
      if ($ === null) {
        return scrapeFailure(failureModes.PHD_COMICS_RSS_REJECTION);
      }
      const items = $("rss channel item");
      if (items.length === 0) {
        return scrapeFailure(failureModes.PHD_COMICS_PARSE_ERROR);
      }
      const firstItemDescriptions = items.first().find("description");
      if (firstItemDescriptions.length === 0) {
        return scrapeFailure(failureModes.PHD_COMICS_PARSE_ERROR);
      }
      const firstItemDescription = unescape(
        firstItemDescriptions.first().html(),
      );
      const $$ = cheerio.load(firstItemDescription);
      const comicImages = $$("img");
      if (comicImages.length !== 1) {
        return scrapeFailure(failureModes.PHD_COMICS_PARSE_ERROR);
      }
      // TODO(ecarrel): scrape hover text too.
      return scrapeSuccess(comicImages.attr("src"));
    }
    case sites.explosm.id: {
      const url = "http://explosm.net/comics/latest";
      const $ = await cheerioRequest(url);
      if ($ === null) {
        return scrapeFailure(failureModes.EXPLOSM_REJECTION);
      }
      const comicImages = $("img#main-comic");
      if (comicImages.length !== 1) {
        return scrapeFailure(failureModes.EXPLOSM_MISSING_IMAGE_ON_PAGE);
      }
      const imageUrl = `http:${comicImages.attr("src")}`;
      return scrapeSuccess(imageUrl);
    }
    case sites.dinosaur.id: {
      const url = "http://www.qwantz.com/";
      const $ = await cheerioRequest(url);
      if ($ === null) {
        return scrapeFailure(failureModes.DINOSAUR_REJECTION);
      }
      const comicImages = $("img.comic");
      if (comicImages.length !== 1) {
        return scrapeFailure(failureModes.DINOSAUR_MISSING_IMAGE_ON_PAGE);
      }
      const imageUrl = `${url}${comicImages.attr("src")}`;
      return scrapeSuccess(imageUrl);
    }
    case sites.threewordphrase.id: {
      const url = "http://threewordphrase.com/";
      const $ = await cheerioRequest(url);
      if ($ === null) {
        return scrapeFailure(failureModes.THREE_WORD_PHRASE_REJECTION);
      }
      const comicImages = $("table tbody tr td center img");
      if (comicImages.length !== 1) {
        return scrapeFailure(
          failureModes.THREE_WORD_PHRASE_MISSING_IMAGE_ON_PAGE,
        );
      }
      const imageUrl = `${url}${comicImages.attr("src")}`;
      return scrapeSuccess(imageUrl);
    }
    default: {
      return scrapeFailure(failureModes.UNKNOWN_SITE);
    }
  }
};

const createComicDbObject = (
  syndication: ISyndication,
  date: Moment,
  scrapeResult: ScrapeResult,
) => {
  const { success, imageUrl, failureMode, imageCaption } = scrapeResult;
  return {
    syndication,
    date: date.toDate(),
    imageUrl,
    imageCaption,
    success,
    failureMode,
  };
};

// TODO(ecarrel): dedupe code that exists here and in scrapeAndSaveAllComics.
export const scrapeAndSaveComic = async (
  syndication: ISyndication,
  date: Moment,
) => {
  const scrapeResult = await scrapeComic(syndication, date);
  const createdComic = await Comic.create(
    createComicDbObject(syndication, date, scrapeResult),
  );
  // eslint-disable-next-line no-param-reassign
  syndication.lastAttemptedComicScrapeDate = date.toDate();
  if (scrapeResult.success) {
    // eslint-disable-next-line no-param-reassign
    syndication.lastSuccessfulComicScrapeDate = date.toDate();
    // eslint-disable-next-line no-param-reassign
    syndication.lastSuccessfulComic = createdComic;
  }
  await syndication.save();
};

export const scrapeAndSaveAllComics = async (
  date: Moment,
  options: ScrapeAndSaveAllComicsOptions = {},
) => {
  const {
    siteId,
    limit = 20,
    dontRescrapeSyndicationThatSucceededEarlierToday = true,
    dontRetryInLessThanAnHour = true,
  } = options;
  let syndicationsRequest = Syndication.find();
  if (siteId) {
    syndicationsRequest = syndicationsRequest.where("site_id").equals(siteId);
  }
  if (dontRescrapeSyndicationThatSucceededEarlierToday) {
    syndicationsRequest = syndicationsRequest.or([
      {
        lastSuccessfulComicScrapeDate: {
          $lt: date.clone().startOf("day").toDate(),
        },
      },
      { lastSuccessfulComicScrapeDate: { $exists: false } },
    ]);
  }
  if (dontRetryInLessThanAnHour) {
    syndicationsRequest = syndicationsRequest.or([
      {
        lastAttemptedComicScrapeDate: {
          $lt: date.clone().subtract(1, "hour").toDate(),
        },
      },
      { lastAttemptedComicScrapeDate: { $exists: false } },
    ]);
  }
  syndicationsRequest = syndicationsRequest.sort({
    // Order by last attempted scrape date in ascending order (that is, we start with the ones
    // that were last attempted the longest ago).
    lastAttemptedComicScrapeDate: 1,
  });
  if (limit !== 0) {
    syndicationsRequest = syndicationsRequest.limit(limit);
  }
  const syndications = await syndicationsRequest.exec();
  const scrapeResults = await Promise.all(
    syndications.map((syndication: ISyndication) =>
      scrapeComic(syndication, date),
    ),
  );
  const augmentedScrapeResults = scrapeResults.map((scrapeResult, i) => ({
    syndication: syndications[i],
    scrapeResult,
  }));
  const comics = augmentedScrapeResults.map(({ syndication, scrapeResult }) =>
    createComicDbObject(syndication, date, scrapeResult),
  );
  let createdComics: IComic[] = [];
  if (comics.length > 0) {
    createdComics = await Comic.create(comics);
  }
  const updatedSyndications = augmentedScrapeResults.map(
    ({ syndication, scrapeResult }) => {
      // eslint-disable-next-line no-param-reassign
      syndication.lastAttemptedComicScrapeDate = date.toDate();
      if (scrapeResult.success) {
        // eslint-disable-next-line no-param-reassign
        syndication.lastSuccessfulComicScrapeDate = date.toDate();
        // TODO(ecarrel): there's gotta be a better way to do this.
        const createdComic = createdComics.find(
          (comic: IComic) =>
            comic.syndication.identifier === syndication.identifier,
        );
        if (createdComic != null) {
          // eslint-disable-next-line no-param-reassign
          syndication.lastSuccessfulComic = createdComic;
        }
      }
      return syndication;
    },
  );
  if (updatedSyndications.length > 0) {
    // TODO(ecarrel): batch this.
    await Promise.all(
      updatedSyndications.map((updatedSyndication) =>
        updatedSyndication.save(),
      ),
    );
  }
};
