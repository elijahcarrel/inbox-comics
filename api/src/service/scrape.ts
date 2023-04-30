import { Moment } from "moment-timezone";
import {
  Comic,
  failureModes,
  IComic,
  ISyndication,
  Syndication,
} from "../db-models/comic-syndication";
import { ScrapeAndSaveAllComicsOptions } from "../api-models/scrape-options";
import { sites } from "./scraper/sites";
import { scrapeFailure, ScrapeResult } from "./scraper/scraper";

export const scrapeComicForSyndication = async (
  syndication: ISyndication,
  date: Moment,
): Promise<ScrapeResult> => {
  const { site_id: siteId } = syndication;
  const site = sites[siteId];
  if (site == null) {
    return scrapeFailure(failureModes.UNKNOWN_SITE);
  }
  return site.scraper.scrape(date, syndication);
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

// TODO(ecarrel): dedupe code that exists here and in scrapeAndSaveAllComicsWithOptions.
export const scrapeAndSaveComicForSyndication = async (
  syndication: ISyndication,
  date: Moment,
) => {
  const scrapeResult = await scrapeComicForSyndication(syndication, date);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TS2615 see https://github.com/microsoft/TypeScript/issues/38279.
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

export const scrapeAndSaveAllComicsWithOptions = async (
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
      scrapeComicForSyndication(syndication, date),
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
