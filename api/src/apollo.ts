import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { resolvers, typeDefs } from "./router";

export const initApollo = (): ((_req: any, _res: any) => Promise<unknown>) => {
  const apolloServer = new ApolloServer({
    introspection: process.env.NODE_ENV !== "production",
    typeDefs,
    resolvers,
    formatError: (error: any) => {
      // eslint-disable-next-line  no-console
      console.error(error);
      return error;
    },
    plugins: [
      {
        async requestDidStart() {
          return {
            async willSendResponse(requestContext) {
              const { response } = requestContext;
              // eslint-disable-next-line  no-console
              console.log(response);
            },
          };
        },
      },
    ],
  });

  return startServerAndCreateNextHandler(apolloServer);
};
