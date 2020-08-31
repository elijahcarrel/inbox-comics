import { gql, UserInputError } from "apollo-server-micro";
import { v4 as uuidv4 } from "uuid";
import { InputUser } from "../api-models/user";
import { User } from "../db-models/user";
import { sendContactEmail } from "../service/email/templates/send-contact-email";
import { sendVerificationEmail } from "../service/email/templates/send-verification-email";
import {
  internalEmailSendError,
  invalidUserByPublicIdError,
  invalidUserError,
} from "../util/error";
import { Syndication } from "../db-models/comic-syndication";

export const typeDefs = gql`
  input InputUser {
    publicId: ID
    email: String
    syndications: [String]
  }
  type User {
    email: String
    verified: Boolean!
    syndications: [Syndication]!
    emails: [Email]!
    publicId: ID!
  }
  extend type Query {
    userByEmail(email: String!): User
    userByPublicId(publicId: ID!): User
  }
  extend type Mutation {
    createUser(email: String!): User
    createUserWithoutEmail: User
    putUser(publicId: String!, user: InputUser): User
    resendVerificationEmail(email: String!): Boolean
    verifyEmail(email: String!, verificationHash: String!): Boolean
    submitContactForm(
      email: String!
      name: String!
      subject: String!
      message: String!
    ): Boolean
  }
`;

export const resolvers = {
  Query: {
    userByEmail: async (_: any, args: { email: string }) => {
      const { email: rawEmail } = args;
      const email = rawEmail.toLowerCase();
      const user = await User.findOne({ email }).exec();
      if (user == null) {
        throw invalidUserError(email);
      }
      // TODO(ecarrel): only populate syndications and emails if they're requested?
      return user.populate("syndications").populate("emails").execPopulate();
    },
    userByPublicId: async (_: any, args: { publicId: string }) => {
      const { publicId } = args;
      const user = await User.findOne({ publicId }).exec();
      if (user == null) {
        throw invalidUserByPublicIdError(publicId);
      }
      // TODO(ecarrel): only populate syndications and emails if they're requested?
      return user.populate("syndications").populate("emails").execPopulate();
    },
  },
  Mutation: {
    createUser: async (_: any, args: { email: string }) => {
      const { email } = args;
      const existingUser = await User.findOne({ email }).exec();
      if (existingUser != null) {
        throw new UserInputError(`User with email "${email}" already exists.`);
      }
      const publicId = uuidv4();
      const verificationHash = uuidv4();
      const googleAnalyticsHash = uuidv4();
      const user = await User.create({
        email,
        publicId,
        verified: false,
        syndications: [],
        verificationHash,
        googleAnalyticsHash,
      });
      try {
        await sendVerificationEmail(email, user.verificationHash);
      } catch (err) {
        throw internalEmailSendError(err);
      }
      return user;
    },
    createUserWithoutEmail: async () => {
      const verificationHash = uuidv4();
      const googleAnalyticsHash = uuidv4();
      const publicId = uuidv4();
      return User.create({
        publicId,
        verified: false,
        syndications: [],
        verificationHash,
        googleAnalyticsHash,
      });
    },
    // TODO(ecarrel): type of user is wrong; should be an api object type.
    putUser: async (_: any, args: { publicId: string; user: InputUser }) => {
      const { publicId, user: inputUser } = args;
      if (publicId !== inputUser.publicId) {
        throw new UserInputError(
          `Mismatched public ids: ${publicId} and ${inputUser.publicId}.`,
        );
      }
      const user = await User.findOne({ publicId }).exec();
      if (user == null) {
        throw invalidUserByPublicIdError(publicId);
      }
      user.syndications = await Syndication.find({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore type of identifier is wrong but appears to work?
        identifier: inputUser.syndications,
      }).exec();
      let inputEmail: string | null = null;
      if (inputUser.email != null) {
        inputEmail = inputUser.email.toLowerCase();
      }
      const changedEmail =
        user.email !== inputEmail &&
        !(user.email == null && inputEmail == null);
      if (changedEmail) {
        const existingUserWithThatEmail = await User.findOne({
          email: inputEmail,
        }).exec();
        if (existingUserWithThatEmail != null) {
          throw new UserInputError(
            `User with email "${inputEmail}" already exists.`,
          );
        }
        user.email = inputEmail;
      }
      await user.save();
      const { email } = user;
      if (changedEmail) {
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore string | null | undefined is not assignable to type string.
          await sendVerificationEmail(email, user.verificationHash);
        } catch (err) {
          throw internalEmailSendError(err);
        }
      }
      return user;
    },
    resendVerificationEmail: async (_: any, args: { email: string }) => {
      const { email } = args;
      const user = await User.findOne({ email }).exec();
      if (user == null) {
        throw invalidUserError(email);
      }
      try {
        await sendVerificationEmail(email, user.verificationHash);
      } catch (err) {
        throw internalEmailSendError(err);
      }
    },
    verifyEmail: async (
      _: any,
      args: { email: string; verificationHash: string },
    ) => {
      const { email, verificationHash } = args;
      const user = await User.findOne({ email }).exec();
      if (user == null) {
        throw invalidUserError(email);
      }
      if (user.verified) {
        // Simply return true. No use returning an error if, say, the user accidentally clicks the link twice.
        return true;
      }
      if (user.verificationHash === verificationHash) {
        user.verified = true;
        await user.save();
        return true;
      }
      throw new UserInputError("Incorrect verification string.");
    },
    submitContactForm: async (
      _: any,
      args: { email: string; name: string; subject: string; message: string },
    ) => {
      const { email, name, subject, message } = args;
      try {
        await sendContactEmail(name, email, subject, message);
      } catch (err) {
        throw internalEmailSendError(err);
      }
    },
  },
};
