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
  // eslint-disable-next-line class-methods-use-this
  async scrape(date: Moment, syndication: ISyndication): Promise<ScrapeResult> {
    const { theiridentifier: theirIdentifier } = syndication;
    const url = `http://www.gocomics.com/${theirIdentifier}/${date.format(
      "YYYY/MM/DD",
    )}`;
    const $ = await cheerioRequest(url);
    if ($ === null) {
      return scrapeFailure(failureModes.GOCOMICS_REJECTION);
    }
    const comicImages = $("picture.item-comic-image img");
    if (comicImages.length !== 1) {
      return scrapeFailure(failureModes.GOCOMICS_MISSING_IMAGE_ON_PAGE);
    }
    return scrapeSuccess(comicImages.attr("src"));
  }
}
