import { Moment } from "moment";
import {
  ISyndication,
  failureModes,
} from "../../../db-models/comic-syndication";
import {
  ScrapeResult,
  cheerioRequest,
  scrapeFailure,
  scrapeSuccess,
} from "../common";
import { Scraper } from "../scraper";

export class ComicsKingdomScraper extends Scraper {
  // eslint-disable-next-line class-methods-use-this
  async scrape(date: Moment, syndication: ISyndication): Promise<ScrapeResult> {
    const { theiridentifier: theirIdentifier } = syndication;
    const url = `https://www.comicskingdom.com/${theirIdentifier}/${date.format(
      "YYYY-MM-DD",
    )}`;
    const $ = await cheerioRequest(url);
    if ($ === null) {
      return scrapeFailure(failureModes.COMICS_KINGDOM_REJECTION);
    }
    const comicImages = $("meta[property='og:image']");
    if (comicImages.length !== 1) {
      return scrapeFailure(failureModes.COMICS_KINGDOM_MISSING_IMAGE_ON_PAGE);
    }
    return scrapeSuccess(comicImages.attr("content"));
  }
}
