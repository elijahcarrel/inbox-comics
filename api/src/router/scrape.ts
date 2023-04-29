import { gql } from "apollo-server-micro";
import {
  scrapeComic,
  scrapeAndSaveComic,
  scrapeAndSaveAllComics,
} from "../validation/scrape";
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
    scrapeComic,
    scrapeAndSaveComic,
    scrapeAndSaveAllComics,
  },
};
