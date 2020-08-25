import { Document, model, Schema } from "mongoose";

export type ComicFailureMode =
  | "UNKNOWN"
  | "UNKNOWN_SITE"
  | "GOCOMICS_REJECTION"
  | "GOCOMICS_MISSING_IMAGE_ON_PAGE"
  | "COMICS_KINGDOM_REJECTION"
  | "COMICS_KINGDOM_MISSING_IMAGE_ON_PAGE"
  | "ARCAMAX_REJECTION"
  | "ARCAMAX_MISSING_IMAGE_ON_PAGE"
  | "XKCD_RSS_REJECTION"
  | "XKCD_PARSE_ERROR"
  | "SMBC_RSS_REJECTION"
  | "SMBC_PARSE_ERROR"
  | "PHD_COMICS_RSS_REJECTION"
  | "PHD_COMICS_PARSE_ERROR"
  | "MISSING_COMICS_KINGDOM_DATA"
  | "COMICS_KINGDOM_EMPTY_IMAGE"
  | "TUNDRA_IMAGE_404"
  | "EXPLOSM_REJECTION"
  | "EXPLOSM_MISSING_IMAGE_ON_PAGE"
  | "THREE_WORD_PHRASE_REJECTION"
  | "THREE_WORD_PHRASE_MISSING_IMAGE_ON_PAGE";

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
  SMBC_RSS_REJECTION: "SMBC_RSS_REJECTION",
  SMBC_PARSE_ERROR: "SMBC_PARSE_ERROR",
  PHD_COMICS_RSS_REJECTION: "PHD_COMICS_RSS_REJECTION",
  PHD_COMICS_PARSE_ERROR: "PHD_COMICS_PARSE_ERROR",
  MISSING_COMICS_KINGDOM_DATA: "MISSING_COMICS_KINGDOM_DATA",
  COMICS_KINGDOM_EMPTY_IMAGE: "COMICS_KINGDOM_EMPTY_IMAGE",
  TUNDRA_IMAGE_404: "TUNDRA_IMAGE_404",
  EXPLOSM_REJECTION: "EXPLOSM_REJECTION",
  EXPLOSM_MISSING_IMAGE_ON_PAGE: "EXPLOSM_MISSING_IMAGE_ON_PAGE",
  THREE_WORD_PHRASE_REJECTION: "THREE_WORD_PHRASE_REJECTION",
  THREE_WORD_PHRASE_MISSING_IMAGE_ON_PAGE:
    "THREE_WORD_PHRASE_MISSING_IMAGE_ON_PAGE",
};

export interface ISyndication extends Document {
  // eslint-disable-next-line camelcase
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
  numSubscribers: number;
}

const syndicationSchema = new Schema({
  site_id: Number,
  title: String,
  identifier: String,
  theiridentifier: String,
  comicskingdomfn: String,
  comicskingdomdir: String,
  comicskingdomfileprefix: String,
  lastSuccessfulComicScrapeDate: Date,
  lastAttemptedComicScrapeDate: Date,
  lastSuccessfulComic: {
    type: Schema.Types.ObjectId,
    ref: "comic",
  },
  numSubscribers: Number,
});
export const Syndication = model<ISyndication>(
  "syndication",
  syndicationSchema,
);

export interface IComic extends Document {
  syndication: ISyndication;
  date: Date;
  imageUrl: string | null;
  imageCaption: string | null;
  success: boolean;
  failureMode: ComicFailureMode | null;
}

const comicSchema = new Schema(
  {
    syndication: {
      type: Schema.Types.ObjectId,
      ref: "syndication",
    },
    date: Date,
    imageUrl: String,
    imageCaption: String,
    success: Boolean,
    failureMode: String,
  },
  { timestamps: true },
);

export const Comic = model<IComic>("comic", comicSchema);
