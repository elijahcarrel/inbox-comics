import mongoose from "mongoose";

export const initMongoose = () => {
  mongoose.Promise = global.Promise;

  const url = process.env.mongodb_url;
  if (url == null) {
    throw new Error("mongodb_url environment variable is not defined.");
  }
  mongoose.set("bufferCommands", false);
  mongoose.set("useUnifiedTopology", true);
  mongoose.set("debug", true);
  mongoose.connect(url, { useNewUrlParser: true });
// tslint:disable-next-line no-console
  mongoose.connection.once("open", () => console.log(`Connected to mongodb.`));
};
