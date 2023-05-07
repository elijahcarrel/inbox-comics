import { gql } from "graphql-tag";
import { computePopularity } from "../handler/popularity";

export const typeDefs = gql`
  extend type Mutation {
    computePopularity: Boolean
  }
`;

export const resolvers = {
  Mutation: {
    computePopularity,
  },
};
