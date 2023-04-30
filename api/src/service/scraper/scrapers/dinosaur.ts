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

export class DinosaurScraper extends Scraper {
  // eslint-disable-next-line class-methods-use-this
  async scrape(
    _date: Moment,
    _syndication: ISyndication,
  ): Promise<ScrapeResult> {
    const url = "http://www.qwantz.com/";
    const $ = await cheerioRequest(url);
    if ($ === null) {
      return scrapeFailure(failureModes.DINOSAUR_REJECTION);
    }
    const comicImages = $("img.comic");
    if (comicImages.length !== 1) {
      return scrapeFailure(failureModes.DINOSAUR_MISSING_IMAGE_ON_PAGE);
    }
    const imageUrl = `${url}${comicImages.attr("src")}`;
    return scrapeSuccess(imageUrl);
  }
}
