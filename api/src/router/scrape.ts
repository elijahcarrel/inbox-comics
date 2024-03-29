import { gql } from "graphql-tag";
import {
  scrapeComic,
  scrapeAndSaveComic,
  scrapeAndSaveAllComics,
} from "../handler/scrape";

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
