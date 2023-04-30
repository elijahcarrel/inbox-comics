import { Moment } from "moment";
import { ISyndication, failureModes } from "../../db-models/comic-syndication";
import { cheerioRequest } from "./common";
import { ScrapeResult, Scraper, scrapeFailure, scrapeSuccess } from "./scraper";

export class GoComicsScraper extends Scraper {
    constructor() {
        super();
    }
    
    async scrape(date: Moment, syndication: ISyndication): Promise<ScrapeResult> {
        const { site_id: siteId, theiridentifier: theirIdentifier } = syndication;
        const url = `http://www.gocomics.com/${theirIdentifier}/${date.format(
            "YYYY/MM/DD",
        )}`;
        const $ = await cheerioRequest(url);
        if ($ === null) {
            return scrapeFailure(failureModes.GOCOMICS_REJECTION);
        }
        const comicImages = $("picture.item-comic-image img");
        if (comicImages.length !== 1) {
            return scrapeFailure(failureModes.GOCOMICS_MISSING_IMAGE_ON_PAGE);
        }
        return scrapeSuccess(comicImages.attr("src"));
    }
}