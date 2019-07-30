import { gql } from "apollo-server-micro";
import { model, Schema } from "mongoose";
import { Comic } from "./comic";

const userSchema = new Schema({
  email: String!,
  verified: Boolean!,
  comics: [{
    type: Schema.Types.ObjectId,
    ref: "comic",
  }],
}, { timestamps: true });

export const User = model("user", userSchema);

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
        // TODO(ecarrel): return error to client appropriately.
        console.error(`No user with email ${email}`);
        return null;
      }
      // TODO(ecarrel): only populate comics if they're requested?
      return await user.populate("comics").execPopulate();
    },
  },
  Mutation: {
    createUser: async (_: any, args: { email: string }) => {
      const { email } = args;
      try {
        return await User.create({ email, verified: false, comics: [] });
      } catch (err) {
        if (err.name === "MongoError" && err.code === 11000) {
          // TODO(ecarrel): return error to client appropriately.
          console.error(`User with email ${email} already exists.`);
          return null;
        }
      }
    },
    setSubscriptions: async (_: any, args: { email: string, comics: string[] }) => {
      const { email, comics } = args;
      const comicObjects = await Comic.find({ identifier: comics }).exec();
      const user = await User.findOne({ email }).exec();
      if (user == null) {
        // TODO(ecarrel): return error to client appropriately.
        console.error(`No user with email ${email}`);
        return null;
      }
      // @ts-ignore comics does not exist on type "document".
      user.comics = comicObjects;
      return await user.save();
    },
  },
};
