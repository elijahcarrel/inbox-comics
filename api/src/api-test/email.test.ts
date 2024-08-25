import mongoose from "mongoose";
import { Moment } from "moment";
import {
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  expect,
  jest,
  it,
} from "@jest/globals";
import { Syndication } from "../db-models/comic-syndication";
import { createUser, putUser } from "../service/user";
import { assertIsDefined } from "../util/ts";
import { scrapeAndSaveComicForSyndication } from "../service/scrape";
import { now } from "../util/date";
import { emailAllUsersWithOptions } from "../service/email/comic-email-service";
import { MOCK_SITE_ID } from "../service/scraper/sites";
import * as sendElasticEmailModule from "../service/email/send-elastic-email";
import { User } from "../db-models/user";
import { NewsItem } from "../db-models/news-item";

// TODO(ecarrel): find a way to make sure this is always mocked.
jest.mock("../service/email/send-elastic-email");
const sendElasticEmail = jest.spyOn(sendElasticEmailModule, "sendElasticEmail");

// TODO(ecarrel): it feels like I shouldn't have to copy the below four functions (beforeAll, beforeEach, afterEach, afterAll) of code into every test, and could instead just define them once?
beforeAll(async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Property 'MONGO_URI' does not exist on type 'Global & typeof globalThis'.ts(2339)
  const uri = global.MONGO_URI;
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await mongoose.connection?.db?.dropDatabase();
});

afterEach(() => {
  sendElasticEmail.mockReset();
});

afterAll(async () => {
  await mongoose.disconnect();
});

const createSyndicationAndVerifiedUserSubscribedToIt = async (date: Moment) => {
  const syndicationIdentifier = "test-syndication";
  const syndication = await Syndication.create({
    site_id: MOCK_SITE_ID,
    title: syndicationIdentifier,
    identifier: syndicationIdentifier,
    theiridentifier: syndicationIdentifier,
    numSubscribers: 0,
  });

  await scrapeAndSaveComicForSyndication(syndication, date);

  const user = await createUser("test@test.com");

  const dbUser = await User.findOne({ email: "test@test.com" });
  assertIsDefined(dbUser);

  expect(sendElasticEmail).toBeCalledTimes(1);
  expect(sendElasticEmail).toHaveBeenLastCalledWith(
    "test@test.com", // recipient
    expect.stringContaining("Verify your Inbox Comics Subscription"), // subject
    expect.stringContaining(dbUser.verificationHash), // body
  );

  // Mock user as verified.
  dbUser.verified = true;
  await dbUser.save();

  assertIsDefined(user.email);
  await putUser(user.publicId, {
    publicId: user.publicId,
    email: user.email || "",
    syndications: [syndication.identifier],
    enabled: true,
  });
};

it("should send email verifications and comic emails to users", async () => {
  const date = now();
  await createSyndicationAndVerifiedUserSubscribedToIt(date);

  // Email comics to this user.
  await emailAllUsersWithOptions(date, {});

  expect(sendElasticEmail).toBeCalledTimes(2);
  expect(sendElasticEmail).toHaveBeenLastCalledWith(
    "test@test.com", // recipient
    expect.stringContaining("Inbox Comics for"), // subject
    expect.stringContaining("mock-image-url"), // body
  );

  // Try to email comics to this user again.
  // Expect no new email to be sent because they have no new comics.
  await emailAllUsersWithOptions(date, {});
  expect(sendElasticEmail).toBeCalledTimes(2);

  // Try to email comics to this user again, this time with the "sendAllComics" flag set to true and the "onlyIfWeHaventCheckedToday" flag set to false to ensure the email is sent anyway.
  await emailAllUsersWithOptions(date, {
    sendAllComics: true,
    onlyIfWeHaventCheckedToday: false,
  });

  // Expect an email to be sent.
  expect(sendElasticEmail).toBeCalledTimes(3);
  expect(sendElasticEmail).toHaveBeenLastCalledWith(
    "test@test.com", // recipient
    expect.stringContaining("Inbox Comics for"), // subject
    expect.stringContaining(
      "wasn't updated today, but here's the most recent comic",
    ), // body
  );
});

it("should send comic emails to users with emailable news items embedded within", async () => {
  const date = now();
  await createSyndicationAndVerifiedUserSubscribedToIt(date);

  const newsItemIdentifier = "test-news-item";
  await NewsItem.create({
    identifier: newsItemIdentifier,
    createTime: date.clone().subtract(1, "day"),
    headline: newsItemIdentifier,
    content: newsItemIdentifier,
    emailContent: newsItemIdentifier,
    shouldSendEmail: true,
    isPublished: true,
  });

  // Email comics to this user.
  await emailAllUsersWithOptions(date, {});

  expect(sendElasticEmail).toBeCalledTimes(2);
  expect(sendElasticEmail).toHaveBeenLastCalledWith(
    "test@test.com", // recipient
    expect.stringContaining("Inbox Comics for"), // subject
    expect.stringContaining(newsItemIdentifier), // body
  );
});

it("should send comic emails to users ignoring non-emailable news items", async () => {
  const date = now();
  await createSyndicationAndVerifiedUserSubscribedToIt(date);

  const newsItemIdentifier = "test-news-item";
  await NewsItem.create({
    identifier: newsItemIdentifier,
    createTime: date.clone().subtract(1, "day"),
    headline: newsItemIdentifier,
    content: newsItemIdentifier,
    emailContent: null,
    shouldSendEmail: false,
    isPublished: true,
  });

  const newsItemIdentifier2 = "test-news-item-2";
  await NewsItem.create({
    identifier: newsItemIdentifier2,
    createTime: date.clone().subtract(2, "day"),
    headline: newsItemIdentifier2,
    content: newsItemIdentifier2,
    emailContent: "",
    shouldSendEmail: false,
    isPublished: true,
  });

  // Email comics to this user.
  await emailAllUsersWithOptions(date, {});

  expect(sendElasticEmail).toBeCalledTimes(2);
  expect(sendElasticEmail).toHaveBeenLastCalledWith(
    "test@test.com", // recipient
    expect.stringContaining("Inbox Comics for"), // subject
    expect.not.stringContaining(newsItemIdentifier), // body
  );
});
