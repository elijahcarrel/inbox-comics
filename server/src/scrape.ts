import { gql, UserInputError } from "apollo-server-micro";
import { scrapeAndSaveAllComics, scrapeAndSaveComic, scrapeComic } from "./scraper/main";
import { Syndication } from "./syndication";
import { now } from "./util/date";

export const typeDefs = gql`
  extend type Mutation {
    scrapeComic(identifier: String!): Boolean,
    scrapeAndSaveComic(identifier: String!): Boolean,
    scrapeAndSaveAllComics: Boolean,
  }
`;

export const resolvers = {
  Mutation: {
    scrapeComic: async (_: any, args: { identifier: string }) => {
      const { identifier } = args;
      const syndication = await Syndication.findOne({ identifier }).exec();
      if (syndication == null) {
        throw new UserInputError(`No syndication with identifier "${identifier}".`);
      }
      const date = now();
      console.log(await scrapeComic(syndication, date));
      return true;
    },
    scrapeAndSaveComic: async (_: any, args: { identifier: string }) => {
      const { identifier } = args;
      const syndication = await Syndication.findOne({ identifier }).exec();
      if (syndication == null) {
        throw new UserInputError(`No syndication with identifier "${identifier}".`);
      }
      const date = now();
      console.log(await scrapeAndSaveComic(syndication, date));
      return true;
    },
    scrapeAndSaveAllComics: async () => {
      const date = now();
      console.log(await scrapeAndSaveAllComics(date));
      return true;
    },
  },
};
