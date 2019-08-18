import { gql } from "apollo-server-micro";
import { NewsItem } from "../models/news-item";

export const typeDefs = gql`
  scalar GraphQLDateTime

  type NewsItem {
    id: ID!
    identifier: String!
    # TODO(ecarrel): use a datetime field for this.
    createTime: String!
    headline: String!
    content: String!
  }

  extend type Query {
    getNews: [NewsItem]
  }
`;

export const resolvers = {
  Query: {
    getNews: async () => {
      return await NewsItem.find().exec();
    },
  },
};
