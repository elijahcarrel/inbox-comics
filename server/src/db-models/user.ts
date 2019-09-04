import { Document, model, Schema } from "mongoose";
import { IComic } from "./comic";
import { ISyndication } from "./syndication";

export interface IUser extends Document {
  publicId: string;
  email: string;
  verified: boolean;
  syndications: ISyndication[];
  lastEmailedComics: IComic[];
  verificationHash: string;
  googleAnalyticsHash: string;
  lastEmailCheck: Date | null;
  lastEmailSent: Date | null;
}

const userSchema = new Schema({
  publicId: String!,
  email: String,
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
  lastEmailSent: Date,
}, { timestamps: true });

export const User = model<IUser>("user", userSchema);
