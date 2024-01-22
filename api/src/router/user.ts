import { gql } from "graphql-tag";
import {
  createUser,
  createUserWithoutEmail,
  unsubscribeUser,
  putUser,
  resendVerificationEmail,
  submitContactForm,
  userByEmail,
  userByPublicId,
  verifyEmail,
} from "../handler/user";

export const typeDefs = gql`
  input InputUser {
    publicId: ID
    email: String
    syndications: [String]
    enabled: Boolean
  }
  type User {
    email: String
    verified: Boolean!
    enabled: Boolean!
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
    unsubscribeUser(email: String!): User
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
    userByEmail,
    userByPublicId,
  },
  Mutation: {
    createUser,
    createUserWithoutEmail,
    unsubscribeUser,
    putUser,
    resendVerificationEmail,
    verifyEmail,
    submitContactForm,
  },
};
