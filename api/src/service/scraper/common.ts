import axios from "axios";
import https from "https";
import * as cheerio from "cheerio";
import {
  ComicFailureMode,
  failureModes,
} from "../../db-models/comic-syndication";

export interface CheerioRequestOptions {
  /** HTTP/2 fetch with Googlebot UA; bypasses GoComics Bunny Shield. */
  useGooglebotUserAgent?: boolean;
}

const GOOGLEBOT_USER_AGENT =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

export const cheerioRequestWithOptions = async (
  url: string,
  options: CheerioRequestOptions = {},
) => {
  try {
    let html = "";

    if (options.useGooglebotUserAgent) {
      const http2 = await import("http2");
      const parsedUrl = new URL(url);

      html = await new Promise((resolve, reject) => {
        const client = http2.connect(parsedUrl.origin, {
          rejectUnauthorized: false,
        });

        client.on("error", (err) => reject(err));

        const req = client.request({
          ":path": parsedUrl.pathname + parsedUrl.search,
          ":method": "GET",
          "user-agent": GOOGLEBOT_USER_AGENT,
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        });

        req.setEncoding("utf8");
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", () => {
          client.close();
          resolve(data);
        });
        req.end();
      });
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

    if (html.length === 0) {
      return null;
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
