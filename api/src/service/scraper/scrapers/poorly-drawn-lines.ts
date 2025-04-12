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

export class PoorlyDrawnLinesScraper extends Scraper {
  async scrape(_: Moment, __: ISyndication): Promise<ScrapeResult> {
    const url = "https://poorlydrawnlines.com/";
    const $ = await cheerioRequest(url);
    if ($ === null) {
      return scrapeFailure(failureModes.POORLY_DRAWN_LINES_REJECTION);
    }
    const comicImages = $("article.category-comic figure.size-full img");
    if (comicImages.length !== 1) {
      return scrapeFailure(
        failureModes.POORLY_DRAWN_LINES_MISSING_IMAGE_ON_PAGE,
      );
    }
    return scrapeSuccess(comicImages.attr("src"));
  }
}
