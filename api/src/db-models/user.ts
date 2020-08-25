import { Document, model, Schema } from "mongoose";
import { IEmail } from "./email";
import { ISyndication, IComic } from "./comic-syndication";

export interface IUser extends Document {
  publicId: string;
  email?: string | null;
  verified: boolean;
  syndications: ISyndication[];
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
