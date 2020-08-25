import { gql } from "apollo-server-micro";
import {
  scrapeAndSaveAllComics,
  scrapeAndSaveComic,
  scrapeComic,
} from "../service/scrape";
import { now } from "../util/date";
import { invalidSyndicationError } from "../util/error";
import { ScrapeAndSaveAllComicsOptions } from "../api-models/scrape-options";
import { Syndication } from "../db-models/comic-syndication";

export const typeDefs = gql`
  input ScrapeAndSaveAllComicsOptions {
    siteId: Int
    limit: Int
    dontRescrapeSyndicationThatSucceededEarlierToday: Boolean
    dontRetryInLessThanAnHour: Boolean
  }
  extend type Mutation {
    scrapeComic(identifier: String!): Boolean
    scrapeAndSaveComic(identifier: String!): Boolean
    scrapeAndSaveAllComics(options: ScrapeAndSaveAllComicsOptions): Boolean
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
    scrapeAndSaveAllComics: async (
      _: any,
      args: { options?: ScrapeAndSaveAllComicsOptions },
    ) => {
      const date = now();
      const { options = {} } = args;
      await scrapeAndSaveAllComics(date, options);
      return true;
    },
  },
};
