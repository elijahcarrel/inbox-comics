import {
  Syndication,
} from "../db-models/comic-syndication";
import { invalidSyndicationError } from "../util/error";
import { now } from "../util/date";
import { scrapeAndSaveAllComicsWithOptions, scrapeAndSaveComicForSyndication, scrapeComicForSyndication } from "../service/scrape";
import { ScrapeAndSaveAllComicsOptions } from "../api-models/scrape-options";

export const scrapeComic = async (_: any, args: { identifier: string }) => {
  const { identifier } = args;
  const syndication = await Syndication.findOne({ identifier }).exec();
  if (syndication == null) {
    throw invalidSyndicationError(identifier);
  }
  const date = now();
  await scrapeComicForSyndication(syndication, date);
  return true;
};

export const scrapeAndSaveComic = async (_: any, args: { identifier: string }) => {
  const { identifier } = args;
  const syndication = await Syndication.findOne({ identifier }).exec();
  if (syndication == null) {
    throw invalidSyndicationError(identifier);
  }
  const date = now();
  await scrapeAndSaveComicForSyndication(syndication, date);
  return true;
};

export const scrapeAndSaveAllComics = async (
  _: any,
  args: { options?: ScrapeAndSaveAllComicsOptions },
) => {
  const date = now();
  const { options = {} } = args;
  await scrapeAndSaveAllComicsWithOptions(date, options);
  return true;
};
