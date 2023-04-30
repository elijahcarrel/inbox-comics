import { Moment } from "moment";
import { ISyndication, failureModes } from "../../db-models/comic-syndication";
import { cheerioRequest, producesSuccessResponse } from "./common";
import { ScrapeResult, Scraper, scrapeFailure, scrapeSuccess } from "./scraper";

export class TundraScraper extends Scraper {
    constructor() {
        super();
    }

    async scrape(date: Moment, syndication: ISyndication): Promise<ScrapeResult> {
        const { site_id: siteId, theiridentifier: theirIdentifier } = syndication;
        const url = `http://www.tundracomicsftp.com/comicspub/daily_tundra/daily/${date.format(
            "YYYY-M-D",
        )}.jpg`;
        if (await producesSuccessResponse(url)) {
            return scrapeSuccess(url);
        }
        return scrapeFailure(failureModes.TUNDRA_IMAGE_404);
    }
}