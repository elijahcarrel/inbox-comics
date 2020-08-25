import { gql } from "apollo-server-micro";
import { emailAllUsers } from "../service/email/comic-email-service";
import { computePopularity } from "../service/popularity";
import { scrapeAndSaveAllComics } from "../service/scrape";
import { now } from "../util/date";
import { EmailAllUsersOptions } from "../api-models/email-options";

export const typeDefs = gql`
  extend type Mutation {
    doWork: Boolean
  }
`;

const daysToSendAllComics: Record<string, boolean> = {
  "May 27th, 2020": true,
};

export const resolvers = {
  Mutation: {
    doWork: async () => {
      const date = now();
      const hour = date.hour();
      if (
        (hour >= 0 && hour < 6) ||
        (hour < 12 && date.format("YYYY-MM-DD") === "2019-12-18")
      ) {
        await scrapeAndSaveAllComics(date);
      } else if (hour >= 6 && hour < 23) {
        const formattedDate = date.format("MMMM Do, YYYY");
        const options: EmailAllUsersOptions = {};
        if (daysToSendAllComics[formattedDate] != null) {
          options.sendAllComics = daysToSendAllComics[formattedDate];
        }
        await emailAllUsers(date, options);
      } else if (hour === 23 && date.minute() > 50) {
        // This will probably get run twice every night, but better safe than sorry.
        await computePopularity();
      }
      return true;
    },
  },
};
