import { gql, UserInputError } from "apollo-server-micro";
import { User } from "../db-models/user";
import {
  emailAllUsers,
  emailUsers,
} from "../service/email/comic-email-service";
import { now } from "../util/date";
import { internalEmailSendError, invalidUserError } from "../util/error";
import { EmailAllUsersOptions } from "../api-models/email-options";

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
  }
  extend type Mutation {
    emailUser(email: String!, options: EmailAllUsersOptions): String
    emailAllUsers(options: EmailAllUsersOptions): [String]
  }
`;

export const resolvers = {
  Mutation: {
    emailUser: async (
      _: any,
      args: { email: string; options?: EmailAllUsersOptions },
    ) => {
      const { email, options = {} } = args;
      const date = now();
      const user = await User.findOne({ email }).exec();
      if (user == null) {
        throw invalidUserError(email);
      }
      if (!user.verified) {
        throw new UserInputError(`User "${email}" is not verified.`);
      }
      let messageIds: (string | null)[] = [];
      try {
        messageIds = await emailUsers([user], options, date);
      } catch (err) {
        throw internalEmailSendError(err);
      }
      if (messageIds.length > 0 && messageIds[0] != null) {
        return messageIds[0];
      }
      return null;
    },
    emailAllUsers: async (_: any, args: { options?: EmailAllUsersOptions }) => {
      const date = now();
      const { options = {} } = args;
      try {
        return await emailAllUsers(date, options);
      } catch (err) {
        throw internalEmailSendError(err);
      }
    },
  },
};
