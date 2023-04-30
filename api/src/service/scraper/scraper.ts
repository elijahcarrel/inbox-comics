import { Moment } from "moment";
import { ISyndication } from "../../db-models/comic-syndication";
import { ScrapeResult } from "./common";

export class Scraper {
  constructor() {
    if (this.constructor === Scraper) {
      throw new Error(
        "Scraper is an abstract class and can't be instantiated.",
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async scrape(
    _date: Moment,
    _syndication: ISyndication,
  ): Promise<ScrapeResult> {
    throw new Error("Method 'scrape()' must be implemented.");
  }
}
