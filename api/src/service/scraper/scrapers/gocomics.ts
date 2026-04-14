import { Moment } from "moment";
import moment from "moment-timezone";
import {
  ISyndication,
  failureModes,
} from "../../../db-models/comic-syndication";
import {
  ScrapeResult,
  cheerioRequestWithOptions,
  scrapeFailure,
  scrapeSuccess,
} from "../common";
import { Scraper } from "../scraper";
import sortBy from "lodash/sortBy";

export class GoComicsScraper extends Scraper {
  async scrape(
    _date: Moment,
    syndication: ISyndication,
  ): Promise<ScrapeResult> {
    const { theiridentifier: theirIdentifier } = syndication;
    const url = `https://www.gocomics.com/${theirIdentifier}`;
    const $ = await cheerioRequestWithOptions(url, {
      useChromeFingerprint: true,
    });
    if ($ === null) {
      return scrapeFailure(failureModes.GOCOMICS_REJECTION);
    }
    const scripts = $('script[type="application/ld+json"]');
    const allScriptObjects = scripts
      .map((_, el): Record<string, any>[] => {
        const jsonText = $(el).html();
        if (!jsonText) {
          return [];
        }
        try {
          const data = JSON.parse(jsonText);
          // Some pages use an array of objects in a single script tag
          const entries = Array.isArray(data) ? data : [data];
          return entries;
        } catch (err) {
          console.log(
            "got error parsing this script as json: ",
            jsonText,
            " error was ",
            err,
          );
          return [];
        }
      })
      .toArray()
      .flat();
    const representativeEntries = allScriptObjects.filter(
      (entry: Record<string, any>) => {
        return (
          entry.representativeOfPage === true &&
          entry["@type"] === "ImageObject"
        );
      },
    );
    const sortedRepresentativeEntries = sortBy(
      representativeEntries,
      (entry: Record<string, any>) => {
        return moment(entry.datePublished, "MMMM D, YYYY").unix();
      },
    );
    const entry =
      sortedRepresentativeEntries?.[sortedRepresentativeEntries.length - 1];
    if (!entry) {
      return scrapeFailure(failureModes.GOCOMICS_MISSING_IMAGE_ON_PAGE);
    }
    const imageUrl = (entry as Record<string, any>)?.contentUrl;
    if (!imageUrl) {
      return scrapeFailure(failureModes.GOCOMICS_MISSING_IMAGE_ON_PAGE);
    }
    return scrapeSuccess(imageUrl);
  }
}
