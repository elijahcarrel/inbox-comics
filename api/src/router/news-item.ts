import { gql } from "apollo-server-micro";
import { getNews, getNewsItem } from "../validation/news-item";

export const typeDefs = gql`
  scalar Date

  type NewsItem {
    id: ID!
    identifier: String!
    # TODO(ecarrel): use a datetime field for this.
    createTime: Date!
    headline: String!
    content: String!
  }

  extend type Query {
    getNews: [NewsItem!]
    getNewsItem(identifier: String!): NewsItem
  }
`;

export const resolvers = {
  Query: {
    getNews,
    getNewsItem,
  },
};
