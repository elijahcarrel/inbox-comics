import { gql } from "graphql-tag";
import {
  emailUser,
  emailAllUsers,
  cancelThrottledEmailsAndSendThemWithAws,
} from "../handler/email";

export const typeDefs = gql`
  type Email {
    sendTime: Date!
    messageId: String!
  }
  input EmailAllUsersOptions {
    sendAllComics: Boolean
    limit: Int
    mentionNotUpdatedComics: Boolean
    onlyIfWeHaventCheckedToday: Boolean
    includeLatestNewsItemEvenIfItsAlreadyBeenSent: Boolean
  }
  input CancelThrottledEmailsOptions {
    limit: Int
  }
  extend type Mutation {
    emailUser(email: String!, options: EmailAllUsersOptions): String
    emailAllUsers(options: EmailAllUsersOptions): [String]
    cancelThrottledEmailsAndSendThemWithAws(
      options: CancelThrottledEmailsOptions
    ): Boolean
  }
`;

export const resolvers = {
  Mutation: {
    emailUser,
    emailAllUsers,
    cancelThrottledEmailsAndSendThemWithAws,
  },
};
