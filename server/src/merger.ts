import merge from "lodash/merge";
import { gql } from "apollo-server-micro";
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

export const resolvers = merge(userResolvers);
export const typeDefs = [rootTypeDefs, userTypeDefs];
