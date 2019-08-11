import { gql } from "apollo-server-micro";
import { Document, model, Schema } from "mongoose";
import { IComic } from "./scraper/main";

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

export const typeDefs = gql`
  type Syndication {
    id: ID!
    title: String
    identifier: String
  }
  extend type Query {
    syndications: [Syndication]
  }
  extend type Mutation {
    addSyndication(title: String!): Syndication
  }
`;

export const resolvers = {
  Query: {
    syndications: async () => {
      return await Syndication.find({}).exec();
    },
  },
  Mutation: {
    addSyndication: async (_: any, args: any) => {
      try {
        return await Syndication.create(args);
      } catch (e) {
        return e.message;
      }
    },
  },
};
