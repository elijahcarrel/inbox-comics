import { Moment } from "moment";
import { Scraper } from "../scraper";
import {
  ISyndication,
  failureModes,
} from "../../../db-models/comic-syndication";
import {
  ScrapeResult,
  producesSuccessResponse,
  scrapeFailure,
  scrapeSuccess,
} from "../common";

export class TundraScraper extends Scraper {
  // eslint-disable-next-line class-methods-use-this
  async scrape(
    date: Moment,
    _syndication: ISyndication,
  ): Promise<ScrapeResult> {
    const url = `http://www.tundracomicsftp.com/comicspub/daily_tundra/daily/${date.format(
      "YYYY-M-D",
    )}.jpg`;
    if (await producesSuccessResponse(url)) {
      return scrapeSuccess(url);
    }
    return scrapeFailure(failureModes.TUNDRA_IMAGE_404);
  }
}
