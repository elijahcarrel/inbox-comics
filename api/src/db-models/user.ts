import { Document, model, Schema } from "mongoose";
import { IEmail } from "./email";
import { ISyndication, IComic } from "./comic-syndication";
import { INewsItem } from "./news-item";

export interface IUser extends Document {
  publicId: string;
  email?: string | null;
  verified: boolean;
  enabled: boolean;
  syndications: ISyndication[];
  lastEmailedNewsItem?: INewsItem | null;
  lastEmailedComics?: IComic[];
  verificationHash: string;
  googleAnalyticsHash: string;
  lastEmailCheck?: Date | null;
  lastEmailSent?: Date | null;
  emails?: IEmail[];
}

const userSchema = new Schema(
  {
    publicId: String,
    email: String,
    verified: Boolean,
    enabled: Boolean,
    syndications: [
      {
        type: Schema.Types.ObjectId,
        ref: "syndication",
      },
    ],
    lastEmailedComics: [
      {
        type: Schema.Types.ObjectId,
        ref: "comic",
      },
    ],
    verificationHash: String,
    lastEmailedNewsItem: {
      type: Schema.Types.ObjectId,
      ref: "newsitem",
    },
    googleAnalyticsHash: String,
    lastEmailCheck: Date,
    lastEmailSent: Date,
    emails: [
      {
        type: Schema.Types.ObjectId,
        ref: "email",
      },
    ],
  },
  { timestamps: true },
);

export const User = model<IUser>("user", userSchema);
