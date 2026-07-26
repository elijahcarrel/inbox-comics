import mongoose from "mongoose";
import { initMongoose } from "../mongoose";
import { Comic } from "../db-models/comic-syndication";
import { Email } from "../db-models/email";

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

const waitForConnection = async () =>
  new Promise<void>((resolve, reject) => {
    if (mongoose.connection.readyState === 1) {
      resolve();
      return;
    }

    mongoose.connection.once("open", () => resolve());
    mongoose.connection.once("error", (err) => reject(err));
  });

const run = async () => {
  try {
    // Uses process.env.mongodb_url, see initMongoose.
    initMongoose();
    await waitForConnection();

    // Ensure TTL index exists on comics.createdAt.
    await Comic.collection.createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: THIRTY_DAYS_IN_SECONDS },
    );

    // Ensure TTL index exists on emails.createdAt.
    await Email.collection.createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: THIRTY_DAYS_IN_SECONDS },
    );
  } catch (err) {
    console.error("Error adding TTL indexes:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void run();
