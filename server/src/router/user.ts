import { gql, UserInputError } from "apollo-server-micro";
import uuid from "uuid";
import { Syndication } from "../models/syndication";
import { User } from "../models/user";
import { sendContactEmail } from "../service/email/templates/send-contact-email";
import { sendVerificationEmail } from "../service/email/templates/send-verification-email";
import { invalidUserError } from "../util/error";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    verified: Boolean!
    syndications: [Syndication]!
  }
  extend type Query {
    #    getUsers: [User]
    userByEmail(email: String!): User
  }
  extend type Mutation {
    createUser(email: String!): User
    setSubscriptions(email: String!, syndications: [String]!): User
    resendVerificationEmail(email: String!): Boolean
    verifyEmail(email: String!, verificationHash: String!): Boolean
    submitContactForm(email: String!, name: String!, subject: String!, message: String!): Boolean
  }
`;

export const resolvers = {
  Query: {
    // getUsers: async () => {
    //   return await User.find({}).exec();
    // },
    userByEmail: async (_: any, args: { email: string }) => {
      const { email } = args;
      const user = await User.findOne({ email }).exec();
      if (user == null) {
        throw invalidUserError(email);
      }
      // TODO(ecarrel): only populate syndications if they're requested?
      return await user.populate("syndications").execPopulate();
    },
  },
  Mutation: {
    createUser: async (_: any, args: { email: string }) => {
      const { email } = args;
      const existingUser = await User.findOne({ email }).exec();
      if (existingUser != null) {
        throw new UserInputError(`User with email "${email}" already exists.`);
      }
      const verificationHash = uuid.v4();
      const googleAnalyticsHash = uuid.v4();
      const user = await User.create({
        email,
        verified: false,
        syndications: [],
        verificationHash,
        googleAnalyticsHash,
      });
      await sendVerificationEmail(email, verificationHash);
      return user;
    },
    setSubscriptions: async (_: any, args: { email: string, syndications: string[] }) => {
      const { email, syndications } = args;
      const syndicationObjects = await Syndication.find({ identifier: syndications }).exec();
      const user = await User.findOne({ email }).exec();
      if (user == null) {
        throw invalidUserError(email);
      }
      user.syndications = syndicationObjects;
      return await user.save();
    },
    resendVerificationEmail: async (_: any, args: { email: string }) => {
      const { email } = args;
      const user = await User.findOne({ email }).exec();
      if (user == null) {
        throw invalidUserError(email);
      }
      // tslint:disable-next-line no-console
      console.log(`Sending verification email to ${email}.`);
      return await sendVerificationEmail(email, user.verificationHash);
    },
    verifyEmail: async (_: any, args: { email: string, verificationHash: string }) => {
      const { email, verificationHash } = args;
      const user = await User.findOne({ email }).exec();
      if (user == null) {
        throw invalidUserError(email);
      }
      if (user.verified) {
        throw new UserInputError(`User "${email}" is already verified.`);
      }
      if (user.verificationHash === verificationHash) {
        user.verified = true;
        await user.save();
        return true;
      }
      throw new UserInputError("Incorrect verification string.");
    },
    submitContactForm: async (_: any, args: { email: string, name: string, subject: string, message: string }) => {
      const { email, name, subject, message } = args;
      return await sendContactEmail(name, email, subject, message);
    },
  },
};
