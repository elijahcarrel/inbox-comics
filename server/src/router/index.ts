import { gql } from "apollo-server-micro";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import merge from "lodash/merge";
import { resolvers as cronReceiverResolvers, typeDefs as cronReceiverTypeDefs } from "./cron-reciever";
import { resolvers as emailResolvers, typeDefs as emailTypeDefs } from "./email";
import { resolvers as newsItemResolvers, typeDefs as newsItemTypeDefs } from "./news-item";
import { resolvers as popularityResolvers, typeDefs as popularityTypeDefs } from "./popularity";
import { resolvers as scrapeResolvers, typeDefs as scrapeTypeDefs } from "./scrape";
import { resolvers as comicResolvers, typeDefs as comicTypeDefs } from "./syndication";
import { resolvers as userResolvers, typeDefs as userTypeDefs } from "./user";

const commonResolver = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    },
  }),
};

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
  popularityResolvers,
  cronReceiverResolvers,
  newsItemResolvers,
  commonResolver,
);
export const typeDefs = [
  rootTypeDefs,
  comicTypeDefs,
  userTypeDefs,
  scrapeTypeDefs,
  emailTypeDefs,
  popularityTypeDefs,
  cronReceiverTypeDefs,
  newsItemTypeDefs,
];
