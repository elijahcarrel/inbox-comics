import { Moment } from "moment";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import unescape from "unescape";
import * as cheerio from "cheerio";
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

export class XkcdScraper extends Scraper {
  // eslint-disable-next-line class-methods-use-this
  async scrape(
    _date: Moment,
    _syndication: ISyndication,
  ): Promise<ScrapeResult> {
    const url = `https://xkcd.com/rss.xml`;
    const $ = await cheerioRequest(url);
    if ($ === null) {
      return scrapeFailure(failureModes.XKCD_RSS_REJECTION);
    }
    const items = $("rss channel item");
    if (items.length === 0) {
      return scrapeFailure(failureModes.XKCD_PARSE_ERROR);
    }
    const firstItemDescriptions = items.first().find("description");
    if (firstItemDescriptions.length === 0) {
      return scrapeFailure(failureModes.XKCD_PARSE_ERROR);
    }
    const firstItemDescription = unescape(firstItemDescriptions.first().html());
    const $$ = cheerio.load(firstItemDescription);
    const comicImages = $$("img");
    if (comicImages.length !== 1) {
      return scrapeFailure(failureModes.XKCD_PARSE_ERROR);
    }
    return scrapeSuccess(comicImages.attr("src"), comicImages.attr("alt"));
  }
}
