import { gql } from "apollo-server-micro";
import { Document, model, Schema } from "mongoose";

export interface IComic extends Document {
  title: string;
  identifier: string;
}

const comicSchema = new Schema({
  title: String,
  identifier: String,
});

export const Comic = model<IComic>("comic", comicSchema);

export const typeDefs = gql`
  type Comic {
    id: ID!
    title: String
    identifier: String
  }
  extend type Query {
    comics: [Comic]
  }
  extend type Mutation {
    addComic(title: String!): Comic
  }
`;

export const resolvers = {
  Query: {
    comics: async () => {
      return await Comic.find({}).exec();
    },
  },
  Mutation: {
    addComic: async (_: any, args: any) => {
      try {
        return await Comic.create(args);
      } catch (e) {
        return e.message;
      }
    },
  },
};
