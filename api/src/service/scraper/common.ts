import axios from "axios";
import https from "https";
import * as cheerio from "cheerio";
import {
  ComicFailureMode,
  failureModes,
} from "../../db-models/comic-syndication";

export interface CheerioRequestOptions {
  useChromeFingerprint?: boolean;
}

export const cheerioRequestWithOptions = async (
  url: string,
  options: CheerioRequestOptions = {},
) => {
  try {
    let html = "";

    if (options.useChromeFingerprint) {
      const puppeteer = require("puppeteer-core");
      const chromium = require("@sparticuz/chromium");

      const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });

      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      html = await page.content();
      
      await browser.close();
    } else {
      // Existing simple configuration
      const axiosConfig: any = {
        method: "GET",
        url,
        responseType: "text",
      };
      axiosConfig.httpsAgent = new https.Agent({ rejectUnauthorized: false });
      const response = await axios(axiosConfig);
      html = response.data;
    }

    return cheerio.load(html);
  } catch (err) {
    console.error(`Error making cheerio request: ${String(err)}`);
    return null;
  }
};

// Keep existing function for backward compatibility
export const cheerioRequest = async (url: string) => {
  return cheerioRequestWithOptions(url, {});
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export const _producesNonEmptyResponse = async (url: string) => {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
  }).catch(() => false);
  if (typeof response === "boolean") {
    return false;
  }
  const content = response.data.read(1);
  return content != null;
};

export const producesSuccessResponse = async (url: string) => {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
  }).catch(() => false);
  if (typeof response === "boolean") {
    return false;
  }
  return response.status === 200;
};

export type ScrapeResult = {
  success: boolean;
  imageUrl: string | null;
  failureMode: ComicFailureMode | null;
  imageCaption: string | null;
};

export const scrapeFailure = (failureMode: ComicFailureMode): ScrapeResult => ({
  success: false,
  imageUrl: null,
  failureMode,
  imageCaption: null,
});

export const scrapeSuccess = (
  imageUrl: string | undefined,
  imageCaption?: string | null,
): ScrapeResult => {
  if (imageUrl == null || imageUrl.length === 0) {
    return scrapeFailure(failureModes.UNKNOWN);
  }
  return {
    success: true,
    imageUrl,
    failureMode: null,
    imageCaption: imageCaption || null,
  };
};
