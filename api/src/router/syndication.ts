import { gql } from "apollo-server-micro";
import { syndications, addSyndication } from "../validation/syndication";

export const typeDefs = gql`
  type Syndication {
    id: ID!
    title: String!
    identifier: String!
    numSubscribers: Int
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
    syndications,
  },
  Mutation: {
    addSyndication,
  },
};
