import { ApolloServer, gql } from 'apollo-server-micro'

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello typescript-world!',
  },
};

const defaultQuery = `query {
  hello
}`;

const apolloServer = new ApolloServer({
  introspection: true,
  playground: {
    tabs: [
      {
        endpoint: process.env.NODE_ENV === 'production' ? 'https://api.inboxcomics.now.sh/graphql' : 'http://localhost:3000/graphql',
        query: defaultQuery,
      },
    ],
  },
  typeDefs,
  resolvers,
});

export default apolloServer.createHandler();
