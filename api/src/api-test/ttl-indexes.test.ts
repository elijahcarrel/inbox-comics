import mongoose, { Document } from "mongoose";
import {
  afterAll,
  beforeAll,
  beforeEach,
  expect,
  it,
} from "@jest/globals";
import { Comic } from "../db-models/comic-syndication";
import { Email } from "../db-models/email";

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;
const TTL_FOR_TEST_SECONDS = 1;

beforeAll(async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Property 'MONGO_URI' does not exist on type 'Global & typeof globalThis'.ts(2339)
  const uri = global.MONGO_URI;
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await mongoose.connection?.db?.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

const waitForDeletion = async (
  findFn: () => Promise<Document | null>,
  timeoutMs = 10_000,
  intervalMs = 500,
) => {
  const start = Date.now();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const doc = await findFn();
    if (doc == null) {
      return;
    }

    if (Date.now() - start > timeoutMs) {
      throw new Error("Document was not deleted within TTL test timeout");
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
};

it("creates a TTL index on comics createdAt with 30 day expiry", async () => {
  await Comic.create({
    syndication: new mongoose.Types.ObjectId(),
    date: new Date(),
    imageUrl: "https://example.com/image.png",
    imageCaption: "caption",
    success: true,
    failureMode: null,
  });

  await Comic.syncIndexes();

  const indexes = await Comic.collection.indexes();
  const ttlIndex = indexes.find(
    (index) =>
      index.key != null &&
      index.key.createdAt === 1 &&
      typeof index.expireAfterSeconds === "number",
  );

  expect(ttlIndex).toBeDefined();
  expect(ttlIndex?.expireAfterSeconds).toBe(THIRTY_DAYS_IN_SECONDS);
});

it("creates a TTL index on emails createdAt with 30 day expiry", async () => {
  await Email.create({
    messageId: "test-message-id",
    sendTime: new Date(),
  });

  await Email.syncIndexes();

  const indexes = await Email.collection.indexes();
  const ttlIndex = indexes.find(
    (index) =>
      index.key != null &&
      index.key.createdAt === 1 &&
      typeof index.expireAfterSeconds === "number",
  );

  expect(ttlIndex).toBeDefined();
  expect(ttlIndex?.expireAfterSeconds).toBe(THIRTY_DAYS_IN_SECONDS);
});

it("deletes expired comics based on TTL index", async () => {
  await Comic.collection.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: TTL_FOR_TEST_SECONDS },
  );

  const pastDate = new Date(Date.now() - 60 * 1000);

  const comic = await Comic.create({
    syndication: new mongoose.Types.ObjectId(),
    date: new Date(),
    imageUrl: "https://example.com/ttl-comic.png",
    imageCaption: "caption",
    success: true,
    failureMode: null,
    createdAt: pastDate,
  });

  await waitForDeletion(() => Comic.findById(comic._id));

  const found = await Comic.findById(comic._id);
  expect(found).toBeNull();
});

it("deletes expired emails based on TTL index", async () => {
  await Email.collection.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: TTL_FOR_TEST_SECONDS },
  );

  const pastDate = new Date(Date.now() - 60 * 1000);

  const email = await Email.create({
    messageId: "ttl-test-message-id",
    sendTime: new Date(),
    createdAt: pastDate,
  });

  await waitForDeletion(() => Email.findById(email._id));

  const found = await Email.findById(email._id);
  expect(found).toBeNull();
});

