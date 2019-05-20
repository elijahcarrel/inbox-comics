import { ApolloServer, gql } from "apollo-server-micro";
import { User } from "./models";
// TODO(ecarrel): fix needing to "require" this code.
require("./db.ts");

const typeDefs = gql`
  type User {
    id: ID!
    userName: String
    email: String
  }
  type Query {
    getUsers: [User]
  }
  type Mutation {
    addUser(userName: String!, email: String!): User
  }
`;

const resolvers = {
  Query: {
    getUsers: async () => {
      return await User.find({}).exec()
    }
  },
  Mutation: {
    addUser: async (_: any, args: any) => {
      try {
        return await User.create(args);
      } catch(e) {
        return e.message;
      }
    }
  }
};


const defaultQuery = `query getUsers {
  getUsers{
    id
    userName
    email
  }
}`;

const apolloServer = new ApolloServer({
  introspection: true,
  playground: {
    tabs: [
      {
        // TODO(ecarrel): make these environment variables rather than hardcoding.
        endpoint: process.env.NODE_ENV === 'production' ? 'https://api.inboxcomics.now.sh/graphql' : 'http://localhost:3000/graphql',
        query: defaultQuery,
      },
    ],
  },
  typeDefs,
  resolvers,
});

export default apolloServer.createHandler();
