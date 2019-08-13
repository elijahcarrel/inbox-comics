import { Document, model, Schema } from "mongoose";
import { ISyndication } from "./syndication";

export type ComicFailureMode =
  "UNKNOWN" |
  "UNKNOWN_SITE" |
  "GOCOMICS_REJECTION" |
  "GOCOMICS_MISSING_IMAGE_ON_PAGE" |
  "COMICS_KINGDOM_REJECTION" |
  "COMICS_KINGDOM_MISSING_IMAGE_ON_PAGE" |
  "ARCAMAX_REJECTION" |
  "ARCAMAX_MISSING_IMAGE_ON_PAGE" |
  "XKCD_RSS_REJECTION" |
  "XKCD_PARSE_ERROR" |
  "MISSING_COMICS_KINGDOM_DATA" |
  "COMICS_KINGDOM_EMPTY_IMAGE";

export const failureModes: { [key: string]: ComicFailureMode } = {
  UNKNOWN: "UNKNOWN",
  UNKNOWN_SITE: "UNKNOWN_SITE",
  GOCOMICS_REJECTION: "GOCOMICS_REJECTION",
  GOCOMICS_MISSING_IMAGE_ON_PAGE: "GOCOMICS_MISSING_IMAGE_ON_PAGE",
  COMICS_KINGDOM_REJECTION: "COMICS_KINGDOM_REJECTION",
  COMICS_KINGDOM_MISSING_IMAGE_ON_PAGE: "COMICS_KINGDOM_MISSING_IMAGE_ON_PAGE",
  ARCAMAX_REJECTION: "ARCAMAX_REJECTION",
  ARCAMAX_MISSING_IMAGE_ON_PAGE: "ARCAMAX_MISSING_IMAGE_ON_PAGE",
  XKCD_RSS_REJECTION: "XKCD_RSS_REJECTION",
  XKCD_PARSE_ERROR: "XKCD_PARSE_ERROR",
  MISSING_COMICS_KINGDOM_DATA: "MISSING_COMICS_KINGDOM_DATA",
  COMICS_KINGDOM_EMPTY_IMAGE: "COMICS_KINGDOM_EMPTY_IMAGE",
};

export interface IComic extends Document {
  syndication: ISyndication;
  date: Date;
  imageUrl: string | null;
  imageCaption: string | null;
  success: boolean;
  failureMode: ComicFailureMode | null;
}

const comicSchema = new Schema({
  syndication: {
    type: Schema.Types.ObjectId,
    ref: "syndication",
  }!,
  date: Date!,
  imageUrl: String,
  imageCaption: String,
  success: Boolean!,
  failureMode: String,
}, {timestamps: true});

export const Comic = model<IComic>("comic", comicSchema);
