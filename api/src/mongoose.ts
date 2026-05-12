import mongoose from "mongoose";

export const initMongoose = () => {
  mongoose.Promise = global.Promise;

  const url = process.env.mongodb_url;
  if (url == null) {
    throw new Error("mongodb_url environment variable is not defined.");
  }
  mongoose.set("debug", true);
  mongoose.connect(url);

  mongoose.connection.once("open", () => console.log(`Connected to mongodb.`));
};
