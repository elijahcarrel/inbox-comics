import mongoose from "mongoose";
import { Syndication } from "../db-models/comic-syndication";
import { createUser, putUser } from "../service/user";
import { assertIsDefined } from "../util/ts";
import { scrapeAndSaveComicForSyndication } from "../service/scrape";
import { now } from "../util/date";
import { emailUsers } from "../service/email/comic-email-service";
import { MOCK_SITE_ID } from "../service/scraper/sites";
import * as sendElasticEmailModule from "../service/email/send-elastic-email";
import { User } from "../db-models/user";

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

jest.mock("../service/email/send-elastic-email");

const sendElasticEmail = jest.spyOn(sendElasticEmailModule, "sendElasticEmail");

it("should email comics to users", async () => {
  const syndicationIdentifier = "test-syndication";
  const syndication = await Syndication.create({
    site_id: MOCK_SITE_ID,
    title: syndicationIdentifier,
    identifier: syndicationIdentifier,
    theiridentifier: syndicationIdentifier,
    numSubscribers: 0,
  });

  const date = now();
  await scrapeAndSaveComicForSyndication(syndication, date);

  const user = await createUser("test@test.com");
  assertIsDefined(user.email);
  await putUser(user.publicId, {
    publicId: user.publicId,
    email: user.email || "",
    syndications: [syndication.identifier],
    enabled: true,
  });

  expect(sendElasticEmail).toBeCalledTimes(1);

  // Mock user as verified.
  const dbUser = await User.findOne({ email: "test@test.com" });
  assertIsDefined(dbUser);
  dbUser.verified = true;
  await dbUser.save();

  // Email comics to this user.
  await emailUsers([dbUser], {}, date);

  expect(sendElasticEmail).toBeCalledTimes(2);

  expect(sendElasticEmail).toHaveBeenLastCalledWith(
    "test@test.com", // recipient
    expect.stringContaining("Inbox Comics for"), // subject
    expect.stringContaining("mock-image-url"), // body
  );
});
