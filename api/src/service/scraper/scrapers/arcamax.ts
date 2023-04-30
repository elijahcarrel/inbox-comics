import { Moment } from "moment";
import { ISyndication, failureModes } from "../../../db-models/comic-syndication";
import { ScrapeResult, cheerioRequest, scrapeFailure, scrapeSuccess } from "../common";
import { Scraper } from "../scraper";

export class ArcamaxScraper extends Scraper {
    directory: string;

    constructor(directory: string) {
        super();
        this.directory = directory;
    }

    async scrape(date: Moment, syndication: ISyndication): Promise<ScrapeResult> {
        const { site_id: siteId, theiridentifier: theirIdentifier } = syndication;
        const url = `https://www.arcamax.com/${this.directory}/${theirIdentifier}/`;
        const $ = await cheerioRequest(url);
        if ($ === null) {
            return scrapeFailure(failureModes.ARCAMAX_REJECTION);
        }
        const comicImages = $("img#comic-zoom");
        if (comicImages.length !== 1) {
            return scrapeFailure(failureModes.ARCAMAX_MISSING_IMAGE_ON_PAGE);
        }
        const imageUrl = comicImages.attr("src");
        return scrapeSuccess(imageUrl);
    }
}