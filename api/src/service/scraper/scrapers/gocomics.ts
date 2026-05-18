import { Moment } from "moment";
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

export class GoComicsScraper extends Scraper {
  async scrape(
    _date: Moment,
    syndication: ISyndication,
  ): Promise<ScrapeResult> {
    const { theiridentifier: theirIdentifier } = syndication;
    const url = `https://www.gocomics.com/${theirIdentifier}/${_date.format("YYYY/MM/DD")}`;
    console.log("[gocomics] scraping", {
      identifier: syndication.identifier,
      theirIdentifier,
      url,
      date: _date.format("YYYY-MM-DD"),
    });
    const $ = await cheerioRequestWithOptions(url, {
      useGooglebotUserAgent: true,
    });
    if ($ === null) {
      console.error("[gocomics] cheerio request failed", { url });
      return scrapeFailure(failureModes.GOCOMICS_REJECTION);
    }
    const scripts = $('script[type="application/ld+json"]');
    console.log("[gocomics] ld+json script tags found", {
      url,
      scriptCount: scripts.length,
    });
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
    const entry = allScriptObjects.find((entry: Record<string, any>) => {
      return (
        entry.representativeOfPage === true && entry["@type"] === "ImageObject"
      );
    });
    if (!entry) {
      const parsedLdJsonObjects = allScriptObjects as Record<string, any>[];
      console.error("[gocomics] missing ImageObject in ld+json", {
        url,
        parsedObjectCount: parsedLdJsonObjects.length,
        types: parsedLdJsonObjects.map((obj) => obj["@type"]),
      });
      return scrapeFailure(failureModes.GOCOMICS_MISSING_IMAGE_ON_PAGE);
    }
    const imageUrl = (entry as Record<string, any>)?.contentUrl;
    if (!imageUrl) {
      console.error("[gocomics] ImageObject missing contentUrl", {
        url,
        entry,
      });
      return scrapeFailure(failureModes.GOCOMICS_MISSING_IMAGE_ON_PAGE);
    }
    console.log("[gocomics] scrape succeeded", { url, imageUrl });
    return scrapeSuccess(imageUrl);
  }
}
