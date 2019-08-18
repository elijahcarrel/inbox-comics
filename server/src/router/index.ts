import { gql } from "apollo-server-micro";
import merge from "lodash/merge";
import { resolvers as cronReceiverResolvers, typeDefs as cronReceiverTypeDefs } from "./cron-reciever";
import { resolvers as emailResolvers, typeDefs as emailTypeDefs } from "./email";
import { resolvers as newsItemResolvers, typeDefs as newsItemTypeDefs } from "./news-item";
import { resolvers as scrapeResolvers, typeDefs as scrapeTypeDefs } from "./scrape";
import { resolvers as comicResolvers, typeDefs as comicTypeDefs } from "./syndication";
import { resolvers as userResolvers, typeDefs as userTypeDefs } from "./user";

const rootTypeDefs = gql`
  type Query {
    # Dummy value so this can be extended.
    _root: String
  }
  type Mutation {
    # Dummy value so this can be extended.
    _root: String
  }
`;

export const resolvers = merge(
  comicResolvers,
  userResolvers,
  scrapeResolvers,
  emailResolvers,
  cronReceiverResolvers,
  newsItemResolvers,
);
export const typeDefs = [
  rootTypeDefs,
  comicTypeDefs,
  userTypeDefs,
  scrapeTypeDefs,
  emailTypeDefs,
  cronReceiverTypeDefs,
  newsItemTypeDefs,
];
