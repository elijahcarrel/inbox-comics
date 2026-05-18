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

  type ScrapeResult {
    success: Boolean!
    imageUrl: String
    failureMode: String
    imageCaption: String
  }

  extend type Mutation {
    scrapeComic(identifier: String!): ScrapeResult!
    scrapeAndSaveComic(identifier: String!): ScrapeResult!
    scrapeAndSaveAllComics(
      options: ScrapeAndSaveAllComicsOptions
    ): [ScrapeResult!]!
  }
`;

export const resolvers = {
  Mutation: {
    scrapeComic,
    scrapeAndSaveComic,
    scrapeAndSaveAllComics,
  },
};
