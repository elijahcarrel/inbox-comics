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

export class GoComicsScraper extends Scraper {
  async scrape(_: Moment, syndication: ISyndication): Promise<ScrapeResult> {
    const { theiridentifier: theirIdentifier } = syndication;
    const url = `https://www.gocomics.com/${theirIdentifier}`;
    const $ = await cheerioRequest(url);
    if ($ === null) {
      return scrapeFailure(failureModes.GOCOMICS_REJECTION);
    }
    const comicImages = $(
      "div[class*='ComicViewer'] button[aria-label='Expand comic'] img",
    );
    if (comicImages.length !== 1) {
      return scrapeFailure(failureModes.GOCOMICS_MISSING_IMAGE_ON_PAGE);
    }
    return scrapeSuccess(comicImages.attr("src"));
  }
}
