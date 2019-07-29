import { gql } from "apollo-server-micro";
import { model, Schema } from "mongoose";

const userSchema = new Schema({
  email: String!,
  verified: Boolean!,
}, { timestamps: true });

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
    createUser(email: String!): User
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
    createUser: async (_: any, args: { email: string }) => {
      const { email } = args;
      try {
        return await User.create({ email, verified: false });
      } catch (e) {
        return e.message;
      }
    },
  },
};
