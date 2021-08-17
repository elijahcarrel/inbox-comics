import { gql } from "apollo-server-micro";
import { emailAllUsers } from "../service/email/comic-email-service";
import { cancelThrottledEmailsAndSendThemWithAws } from "../service/email/cancel-and-send-with-aws";
import { computePopularity } from "../service/popularity";
import { scrapeAndSaveAllComics } from "../service/scrape";
import { now } from "../util/date";

export const typeDefs = gql`
  extend type Mutation {
    doWork: Boolean
  }
`;

export const resolvers = {
  Mutation: {
    doWork: async () => {
      const date = now();
      const promises = [] as Promise<any>[];
      const hour = date.hour();
      if (hour >= 0 && hour < 6) {
        console.log("scraping and saving all comics");
        promises.push(scrapeAndSaveAllComics(date));
      } else if (hour >= 6 && hour < 23) {
        promises.push(emailAllUsers(date));
      }
      if (hour === 23 && date.minute() > 55) {
        // This will probably get run a few times every night, but better safe than sorry.
        promises.push(computePopularity());
      }
      promises.push(cancelThrottledEmailsAndSendThemWithAws());
      await Promise.all(promises);
      return true;
    },
  },
};
