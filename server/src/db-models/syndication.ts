import { Document, model, Schema } from "mongoose";
import { IComic } from "./comic";

export interface ISyndication extends Document {
  site_id: number;
  title: string;
  identifier: string;
  theiridentifier: string;
  comicskingdomfn: string | null;
  comicskingdomdir: string | null;
  comicskingdomfileprefix: string | null;
  lastSuccessfulComicScrapeDate: Date | null;
  lastAttemptedComicScrapeDate: Date | null;
  lastSuccessfulComic: IComic;
}

const syndicationSchema = new Schema({
  site_id: Number!,
  title: String!,
  identifier: String!,
  theiridentifier: String!,
  comicskingdomfn: String,
  comicskingdomdir: String,
  comicskingdomfileprefix: String,
  lastSuccessfulComicScrapeDate: Date,
  lastAttemptedComicScrapeDate: Date,
  lastSuccessfulComic: {
    type: Schema.Types.ObjectId,
    ref: "comic",
  },
});

export const Syndication = model<ISyndication>("syndication", syndicationSchema);
