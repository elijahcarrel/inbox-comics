import { gql } from "apollo-server-micro";
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
