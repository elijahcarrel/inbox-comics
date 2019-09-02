import { gql } from "apollo-server-micro";
import { emailAllUsers } from "../service/email/comic-email-service";
import { computePopularity } from "../service/Popularity";
import { scrapeAndSaveAllComics } from "../service/scrape";
import { now } from "../util/date";

export const typeDefs = gql`
  extend type Mutation {
    doWork: Boolean,
  }
`;

export const resolvers = {
  Mutation: {
    doWork: async () => {
      const date = now();
      const hour = date.hour();
      if (hour >= 0 && hour < 5) {
        await scrapeAndSaveAllComics(date);
      } else if (hour >= 5 && hour < 23) {
        await emailAllUsers(date);
      } else if (hour === 23 && date.minute() > 30) {
        // This will probably get run twice every night, but better safe than sorry.
        await computePopularity();
      }
      return true;
    },
  },
};
