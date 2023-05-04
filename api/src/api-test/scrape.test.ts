import mongoose from "mongoose";
import { Syndication } from "../db-models/comic-syndication";
import { assertIsDefined } from "../util/ts";
import {
  scrapeAndSaveComicForSyndication,
  scrapeComicForSyndication,
} from "../service/scrape";
import { now } from "../util/date";
import { MOCK_SITE_ID } from "../service/scraper/sites";

// TODO(ecarrel): it feels like I shouldn't have to copy the below four functions (beforeAll, beforeEach, afterEach, afterAll) of code into every test, and could instead just define them once?
beforeAll(async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Property 'MONGO_URI' does not exist on type 'Global & typeof globalThis'.ts(2339)
  const uri = global.MONGO_URI;
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  await mongoose.disconnect();
});

it("should scrape comic for syndication", async () => {
  const syndicationIdentifier = "test-syndication";
  const syndication = await Syndication.create({
    site_id: MOCK_SITE_ID,
    title: syndicationIdentifier,
    identifier: syndicationIdentifier,
    theiridentifier: syndicationIdentifier,
    numSubscribers: 0,
  });

  const date = now();
  const scrapedComic = await scrapeComicForSyndication(syndication, date);

  assertIsDefined(scrapedComic);
  expect(scrapedComic).toMatchObject({
    success: true,
    imageUrl: "mock-image-url",
    failureMode: null,
    imageCaption: "mock-image-caption",
  });
});

it("should scrape and save comic for syndication", async () => {
  const syndicationIdentifier = "test-syndication";

  const syndication = await Syndication.create({
    site_id: MOCK_SITE_ID,
    title: syndicationIdentifier,
    identifier: syndicationIdentifier,
    theiridentifier: syndicationIdentifier,
    numSubscribers: 0,
  });

  const date = now();
  const dateIso = date.toISOString();
  await scrapeAndSaveComicForSyndication(syndication, date);

  const updatedSyndication = await Syndication.findOne({
    identifier: syndicationIdentifier,
  });
  assertIsDefined(updatedSyndication);
  await updatedSyndication.populate({ path: "lastSuccessfulComic" });

  expect(updatedSyndication.identifier).toEqual(syndicationIdentifier);
  assertIsDefined(updatedSyndication.lastAttemptedComicScrapeDate);
  expect(updatedSyndication.lastAttemptedComicScrapeDate.toISOString()).toEqual(
    dateIso,
  );
  assertIsDefined(updatedSyndication.lastSuccessfulComicScrapeDate);
  expect(
    updatedSyndication.lastSuccessfulComicScrapeDate.toISOString(),
  ).toEqual(dateIso);
  expect(updatedSyndication.lastSuccessfulComic.imageUrl).toEqual(
    "mock-image-url",
  );
  expect(updatedSyndication.lastSuccessfulComic.imageCaption).toEqual(
    "mock-image-caption",
  );
});
