import { Document, model, Schema } from "mongoose";
import { IComic } from "./comic";
import { ISyndication } from "./syndication";

export interface IUser extends Document {
  email: string;
  verified: boolean;
  syndications: ISyndication[];
  lastEmailedComics: IComic[];
  verificationHash: string;
  googleAnalyticsHash: string;
  lastEmailCheck: Date | null;
}

const userSchema = new Schema({
  email: String!,
  verified: Boolean!,
  syndications: [{
    type: Schema.Types.ObjectId,
    ref: "syndication",
  }],
  lastEmailedComics: [{
    type: Schema.Types.ObjectId,
    ref: "comic",
  }],
  verificationHash: String!,
  googleAnalyticsHash: String!,
  lastEmailCheck: Date,
}, { timestamps: true });

export const User = model<IUser>("user", userSchema);
