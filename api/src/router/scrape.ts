import { gql } from "apollo-server-micro";
import { Syndication } from "../db-models/syndication";
import { scrapeAndSaveAllComics, scrapeAndSaveComic, scrapeComic } from "../service/scrape";
import { now } from "../util/date";
import { invalidSyndicationError } from "../util/error";

export interface ScrapeAndSaveAllComicsOptions {
  // Only scrape comics from a specific siteId ID. Default: all sites.
  siteId?: number;
  // Limit to a max number of comics. 0 results in no limit. Default: 50.
  limit?: number;
  // Don't re-scrape syndications we've already successfully scraped today. Default: true.
  dontRescrapeSyndicationThatSucceededEarlierToday?: boolean;
  // Don't try to scrape it if we've tried already within the last hour. Default: true.
  dontRetryInLessThanAnHour?: boolean;
}

export const typeDefs = gql`
  input ScrapeAndSaveAllComicsOptions {
    siteId: Int,
    limit: Int,
    dontRescrapeSyndicationThatSucceededEarlierToday: Boolean,
    dontRetryInLessThanAnHour: Boolean,
  }
  extend type Mutation {
    scrapeComic(identifier: String!): Boolean,
    scrapeAndSaveComic(identifier: String!): Boolean,
    scrapeAndSaveAllComics(options: ScrapeAndSaveAllComicsOptions): Boolean,
  }
`;

export const resolvers = {
  Mutation: {
    scrapeComic: async (_: any, args: { identifier: string }) => {
      const { identifier } = args;
      const syndication = await Syndication.findOne({ identifier }).exec();
      if (syndication == null) {
        throw invalidSyndicationError(identifier);
      }
      const date = now();
      await scrapeComic(syndication, date);
      return true;
    },
    scrapeAndSaveComic: async (_: any, args: { identifier: string }) => {
      const { identifier } = args;
      const syndication = await Syndication.findOne({ identifier }).exec();
      if (syndication == null) {
        throw invalidSyndicationError(identifier);
      }
      const date = now();
      await scrapeAndSaveComic(syndication, date);
      return true;
    },
    scrapeAndSaveAllComics: async (_: any, args: { options?: ScrapeAndSaveAllComicsOptions } ) => {
      const date = now();
      const { options = {} } = args;
      await scrapeAndSaveAllComics(date, options);
      return true;
    },
  },
};
