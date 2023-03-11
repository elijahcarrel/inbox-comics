import { gql } from "apollo-server-micro";
import { NewsItem } from "../db-models/news-item";
import { invalidNewsItemError } from "../util/error";

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
    getNews: async () => {
      return NewsItem.find({ isPublished: true }).sort({ createTime: -1 }).exec();
    },
    getNewsItem: async (_: any, args: { identifier: string }) => {
      const { identifier } = args;
      const newsItem = await NewsItem.findOne({ identifier }).exec();
      if (newsItem == null) {
        throw invalidNewsItemError(identifier);
      }
      return newsItem;
    },
  },
};
