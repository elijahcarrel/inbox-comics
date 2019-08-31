import { gql } from "apollo-server-micro";
import { Syndication } from "../db-models/syndication";

export const typeDefs = gql`
  type Syndication {
    id: ID!
    title: String!
    identifier: String!
  }
  extend type Query {
    syndications: [Syndication!]
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
