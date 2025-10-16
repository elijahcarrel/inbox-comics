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
    const axiosConfig: any = {
      method: "GET",
      url,
      responseType: "text",
    };

    if (options.useChromeFingerprint) {
      // Chrome 120 TLS configuration
      const httpsAgent = new https.Agent({
        // TLS 1.2 and 1.3 support (Chrome 120 uses both)
        minVersion: "TLSv1.2",
        maxVersion: "TLSv1.3",

        // Chrome 120 cipher suites (prioritized order)
        ciphers: [
          "TLS_AES_128_GCM_SHA256",
          "TLS_AES_256_GCM_SHA384",
          "TLS_CHACHA20_POLY1305_SHA256",
          "ECDHE-ECDSA-AES128-GCM-SHA256",
          "ECDHE-RSA-AES128-GCM-SHA256",
          "ECDHE-ECDSA-AES256-GCM-SHA384",
          "ECDHE-RSA-AES256-GCM-SHA384",
        ].join(":"),

        honorCipherOrder: true,
        rejectUnauthorized: false,
      });

      axiosConfig.httpsAgent = httpsAgent;

      // Chrome 120 headers
      axiosConfig.headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "sec-ch-ua":
          '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      };
    } else {
      // Existing simple configuration
      axiosConfig.httpsAgent = new https.Agent({ rejectUnauthorized: false });
    }

    const response = await axios(axiosConfig);
    // TODO(ecarrel): check if response.request.res.responseUrl !== url to detect redirects.
    return cheerio.load(response.data);
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
// eslint-disable-next-line no-underscore-dangle,@typescript-eslint/no-unused-vars
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
