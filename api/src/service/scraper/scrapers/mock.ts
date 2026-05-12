import { Moment } from "moment";
import { ISyndication } from "../../../db-models/comic-syndication";
import { ScrapeResult, scrapeSuccess } from "../common";
import { Scraper } from "../scraper";

export class MockScraper extends Scraper {
  async scrape(
    _date: Moment,
    _syndication: ISyndication,
  ): Promise<ScrapeResult> {
    return scrapeSuccess("mock-image-url", "mock-image-caption");
  }
}
