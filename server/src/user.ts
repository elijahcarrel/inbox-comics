import { gql, UserInputError } from "apollo-server-micro";
import { Document, model, Schema } from "mongoose";
import uuid from "uuid";
import { Comic, IComic } from "./comic";
import { sendVerificationEmail } from "./email/send-verification-email";

interface IUser extends Document {
  email: string;
  verified: boolean;
  comics: IComic[];
  verificationHash: string;
}

const userSchema = new Schema({
  email: String!,
  verified: Boolean!,
  comics: [{
    type: Schema.Types.ObjectId,
    ref: "comic",
  }],
  verificationHash: String!,
}, { timestamps: true });

export const User = model<IUser>("user", userSchema);

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    verified: Boolean!
    comics: [Comic]!
  }
  extend type Query {
#    getUsers: [User]
    userByEmail(email: String!): User
  }
  extend type Mutation {
    createUser(email: String!): User
    setSubscriptions(email: String!, comics: [String]!): User
    resendVerificationEmail(email: String!): Boolean
    verifyEmail(email: String!, verificationHash: String!): Boolean
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
        throw new UserInputError(`No user with email ${email}`);
      }
      // TODO(ecarrel): only populate comics if they're requested?
      return await user.populate("comics").execPopulate();
    },
  },
  Mutation: {
    createUser: async (_: any, args: { email: string }) => {
      const { email } = args;
      const existingUser = await User.findOne({ email }).exec();
      if (existingUser != null) {
        throw new UserInputError(`User with email ${email} already exists.`);
      }
      const verificationHash = uuid.v4();
      const user = await User.create({ email, verified: false, comics: [], verificationHash });
      await sendVerificationEmail(email, verificationHash);
      return user;
    },
    setSubscriptions: async (_: any, args: { email: string, comics: string[] }) => {
      const { email, comics } = args;
      const comicObjects = await Comic.find({ identifier: comics }).exec();
      const user = await User.findOne({ email }).exec();
      if (user == null) {
        throw new UserInputError(`No user with email ${email}.`);
      }
      user.comics = comicObjects;
      return await user.save();
    },
    resendVerificationEmail: async (_: any, args: { email: string }) => {
      const { email } = args;
      const user = await User.findOne({ email }).exec();
      if (user == null) {
        throw new UserInputError(`No user with email ${email}`);
      }
      // tslint:disable-next-line no-console
      console.log(`Sending verification email to ${email}.`);
      return await sendVerificationEmail(email, user.verificationHash);
    },
    verifyEmail: async (_: any, args: { email: string, verificationHash: string }) => {
      const { email, verificationHash } = args;
      const user = await User.findOne({ email }).exec();
      if (user == null) {
        throw new UserInputError(`No user with email ${email}`);
      }
      // @ts-ignore verified does not exist on type "document".
      if (user.verified) {
        throw new UserInputError(`User ${email} is already verified.`);
      }
      if (user.verificationHash === verificationHash) {
        // @ts-ignore verified does not exist on type "document".
        user.verified = true;
        await user.save();
        return true;
      }
      throw new UserInputError(`Incorrect verification string.`);
    },
  },
};
