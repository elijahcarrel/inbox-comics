import mongoose from "mongoose";
import { Syndication } from "../db-models/comic-syndication";
import { createUser, putUser } from "../service/user";
import { computePopularity } from "../service/popularity";
import { assertIsDefined } from "../util/ts";

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

it("should compute popularity", async () => {
  const syndication1Identifier = "test-syndication";
  const syndication1 = await Syndication.create({
    site_id: 0,
    title: syndication1Identifier,
    identifier: syndication1Identifier,
    theiridentifier: syndication1Identifier,
    numSubscribers: 0,
  });

  const syndication2Identifier = "test-syndication-2";
  await Syndication.create({
    site_id: 0,
    title: syndication2Identifier,
    identifier: syndication2Identifier,
    theiridentifier: syndication2Identifier,
    numSubscribers: 0,
  });
  const user = await createUser("test@test.com");
  assertIsDefined(user.email);
  await putUser(user.publicId, {
    publicId: user.publicId,
    email: user.email || "",
    syndications: [syndication1.identifier],
    enabled: true,
  });
  await computePopularity();

  const gotSyndication1 = await Syndication.findOne({
    identifier: syndication1Identifier,
  });
  assertIsDefined(gotSyndication1);
  expect(gotSyndication1.numSubscribers).toBe(1);

  const gotSyndication2 = await Syndication.findOne({
    identifier: syndication2Identifier,
  });
  assertIsDefined(gotSyndication2);
  expect(gotSyndication2.numSubscribers).toBe(0);
});
