import { ApolloServer } from "apollo-server-micro";
import { typeDefs, resolvers } from "./merger";
// TODO(ecarrel): fix needing to "require" this code.
require("./db.ts");

const defaultQuery = `query getUsers {
  getUsers{
    id
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
