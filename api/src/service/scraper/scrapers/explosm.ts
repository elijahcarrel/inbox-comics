import { Moment } from "moment";
import { ISyndication, failureModes } from "../../db-models/comic-syndication";
import { cheerioRequest } from "./common";
import { ScrapeResult, Scraper, scrapeFailure, scrapeSuccess } from "./scraper";

export class ExplosmScraper extends Scraper {
    constructor() {
        super();
    }

    async scrape(date: Moment, syndication: ISyndication): Promise<ScrapeResult> {
        const { site_id: siteId, theiridentifier: theirIdentifier } = syndication;
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
