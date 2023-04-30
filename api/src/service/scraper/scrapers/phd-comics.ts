import { Moment } from "moment";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import unescape from "unescape";
import cheerio from "cheerio";
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

export class PhdComicsScraper extends Scraper {
  // eslint-disable-next-line class-methods-use-this
  async scrape(
    _date: Moment,
    _syndication: ISyndication,
  ): Promise<ScrapeResult> {
    const url = `http://phdcomics.com/gradfeed.php`;
    const $ = await cheerioRequest(url);
    if ($ === null) {
      return scrapeFailure(failureModes.PHD_COMICS_RSS_REJECTION);
    }
    const items = $("rss channel item");
    if (items.length === 0) {
      return scrapeFailure(failureModes.PHD_COMICS_PARSE_ERROR);
    }
    const firstItemDescriptions = items.first().find("description");
    if (firstItemDescriptions.length === 0) {
      return scrapeFailure(failureModes.PHD_COMICS_PARSE_ERROR);
    }
    const firstItemDescription = unescape(firstItemDescriptions.first().html());
    const $$ = cheerio.load(firstItemDescription);
    const comicImages = $$("img");
    if (comicImages.length !== 1) {
      return scrapeFailure(failureModes.PHD_COMICS_PARSE_ERROR);
    }
    // TODO(ecarrel): scrape hover text too.
    return scrapeSuccess(comicImages.attr("src"));
  }
}
