import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const url = process.env.NODE_ENV === 'production' ? process.env.mongodb_url : 'mongodb://127.0.0.1:27017/ic';
if (url == null) {
  throw new Error("mongodb_url secret is not defined.");
}
mongoose.set('bufferCommands', false);
mongoose.set('debug', true);
mongoose.connect(url, { useNewUrlParser: true });
mongoose.connection.once('open', () => console.log(`Connected to mongo at ${url}`));
