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
        // Scrape comics.
        // tslint:disable-next-line max-line-length no-console
        // console.log("doWork called at ", date.format("dddd, MMMM Do YYYY, h:mm:ss a"), " and thus is going to scrape comics.");
        await scrapeAndSaveAllComics(date);
      } else if (date.hour() > 5) {
        // Email users.
        // tslint:disable-next-line max-line-length no-console
        // console.log("doWork called at ", date.format("dddd, MMMM Do YYYY, h:mm:ss a"), " and thus is going to send emails.");
        await emailAllUsers(date);
      }
      return true;
    },
  },
};
