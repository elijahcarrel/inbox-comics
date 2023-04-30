import { scrapeAndSaveAllComicsWithOptions } from "../service/scrape";
import { now } from "../util/date";
import { cancelThrottledEmailsAndSendThemWithAwsWithOptions } from "../service/email/cancel-and-send-with-aws";
import { emailAllUsersWithOptions } from "../service/email/comic-email-service";
import { computePopularity } from "../service/popularity";

export const doWork = async () => {
  const date = now();
  const promises = [] as Promise<any>[];
  const hour = date.hour();
  if (hour >= 0 && hour < 6) {
    // eslint-disable-next-line  no-console
    console.log("scraping and saving all comics");
    promises.push(scrapeAndSaveAllComicsWithOptions(date));
  } else if (hour >= 6 && hour < 23) {
    promises.push(emailAllUsersWithOptions(date));
  }
  if (hour === 23 && date.minute() > 55) {
    // This will probably get run a few times every night, but better safe than sorry.
    promises.push(computePopularity());
  }
  promises.push(cancelThrottledEmailsAndSendThemWithAwsWithOptions());
  await Promise.all(promises);
  return true;
};
