import { gql } from "graphql-tag";
import { doWork } from "../handler/cron-receiver";

export const typeDefs = gql`
  extend type Mutation {
    doWork: Boolean
  }
`;

export const resolvers = {
  Mutation: {
    doWork,
  },
};
