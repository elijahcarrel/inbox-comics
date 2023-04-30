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

export class ThreeWordPhraseScraper extends Scraper {
  // eslint-disable-next-line class-methods-use-this
  async scrape(
    _date: Moment,
    _syndication: ISyndication,
  ): Promise<ScrapeResult> {
    const url = "http://threewordphrase.com/";
    const $ = await cheerioRequest(url);
    if ($ === null) {
      return scrapeFailure(failureModes.THREE_WORD_PHRASE_REJECTION);
    }
    const comicImages = $("table tbody tr td center img");
    if (comicImages.length !== 1) {
      return scrapeFailure(
        failureModes.THREE_WORD_PHRASE_MISSING_IMAGE_ON_PAGE,
      );
    }
    const imageUrl = `${url}${comicImages.attr("src")}`;
    return scrapeSuccess(imageUrl);
  }
}
