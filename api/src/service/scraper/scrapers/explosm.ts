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

export class ExplosmScraper extends Scraper {
  // eslint-disable-next-line class-methods-use-this
  async scrape(
    _date: Moment,
    _syndication: ISyndication,
  ): Promise<ScrapeResult> {
    const url = "http://explosm.net/comics/latest";
    const $ = await cheerioRequest(url);
    if ($ === null) {
      return scrapeFailure(failureModes.EXPLOSM_REJECTION);
    }
    const comicImages = $("#comic img");
    if (comicImages.length === 0) {
      return scrapeFailure(failureModes.EXPLOSM_MISSING_IMAGE_ON_PAGE);
    }
    const imageUrl = comicImages.first().attr("src");
    return scrapeSuccess(imageUrl);
  }
}
