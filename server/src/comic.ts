import { gql } from "apollo-server-micro";
import { model, Schema } from "mongoose";

const comicSchema = new Schema({
  title: String,
});

export const Comic = model("comic", comicSchema);

export const typeDefs = gql`
  type Comic {
    id: ID!
    title: String
  }
  extend type Query {
    comics: [Comic]
  }
  extend type Mutation {
    addComic(email: String!): Comic
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