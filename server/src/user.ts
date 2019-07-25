import { gql } from "apollo-server-micro";
import { model, Schema } from "mongoose";

const userSchema = new Schema({
  email: String,
  verified: Boolean,
});

export const User = model("user", userSchema);

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    verified: Boolean
  }
  extend type Query {
#    getUsers: [User]
    userByEmail(email: String): User
  }
  extend type Mutation {
    addUser(email: String!): User
  }
`;

export const resolvers = {
  Query: {
    // getUsers: async () => {
    //   return await User.find({}).exec();
    // },
    userByEmail: async (_: any, args: { email: string }) => {
      const { email } = args;
      return await User.findOne({ email }).exec();
    },
  },
  Mutation: {
    addUser: async (_: any, args: any) => {
      try {
        return await User.create(args);
      } catch (e) {
        return e.message;
      }
    },
  },
};
