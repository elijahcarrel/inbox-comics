import { gql, UserInputError } from "apollo-server-micro";
import { User } from "../models/user";
import { emailAllUsers, emailUsers } from "../service/email/comic-email-service";
import { now } from "../util/date";
import { invalidUserError } from "../util/error";

export interface EmailAllUsersOptions {
  // Send all comics, regardless of if they were updated. Default: false.
  sendAllComics?: boolean;
  // Mention comics that were not updated (as opposed to just omitting them from the email entirely). Default: true.
  mentionNotUpdatedComics?: boolean;
  // Only email each user if we haven't already tried to send them an email today ("tried" means that we
  // looked to see if they deserved an email and sent them one if they did). Default: true.
  onlyIfWeHaventCheckedToday?: boolean;
}

export const typeDefs = gql`
  input EmailAllUsersOptions {
    sendAllComics: Boolean,
    mentionNotUpdatedComics: Boolean,
    onlyIfWeHaventCheckedToday: Boolean,
  }
  extend type Mutation {
    emailUser(email: String!, options: EmailAllUsersOptions): Boolean,
    emailAllUsers(options: EmailAllUsersOptions): Boolean,
  }
`;

export const resolvers = {
  Mutation: {
    emailUser: async (_: any, args: { email: string } & EmailAllUsersOptions) => {
      const { email, ...emailAllUsersOptions } = args;
      const date = now();
      const user = await User.findOne({ email }).exec();
      if (user == null) {
        throw invalidUserError(email);
      }
      if (!user.verified) {
        throw new UserInputError(`User "${email}" is not verified.`);
      }
      return await emailUsers([user], emailAllUsersOptions, date);
    },
    emailAllUsers: async (_: any, args: { options?: EmailAllUsersOptions }) => {
      const date = now();
      const { options = {} } = args;
      return await emailAllUsers(date, options);
    },
  },
};
