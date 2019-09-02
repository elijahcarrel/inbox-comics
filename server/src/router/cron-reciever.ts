import { gql } from "apollo-server-micro";
import { emailAllUsers } from "../service/email/comic-email-service";
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
      } else if (date.hour() >= 5) {
        await emailAllUsers(date);
      }
      return true;
    },
  },
};
