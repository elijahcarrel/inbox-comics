import { ApolloServer } from "apollo-server-micro";
import gql from "graphql-tag";
import { resolvers, typeDefs } from "./router";

const endpoint = "/api/graphql";

export const initApollo = (): ((_req: any, _res: any) => Promise<void>) => {
  const defaultQuery = gql`
    query comics {
      syndications {
        title
      }
    }
  `;

  const apolloServer = new ApolloServer({
    introspection: process.env.NODE_ENV !== "production",
    playground: {
      tabs: [
        {
          endpoint,
          query: String(defaultQuery),
        },
      ],
    },
    typeDefs,
    resolvers,
    formatError: (error: any) => {
      // eslint-disable-next-line  no-console
      console.error(error);
      return error;
    },
    formatResponse: (response: any) => {
      // eslint-disable-next-line  no-console
      console.log(response);
      return response;
    },
  });

  return apolloServer.createHandler({ path: endpoint });
};
