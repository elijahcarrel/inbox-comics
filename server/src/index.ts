import { ApolloServer } from "apollo-server-micro";
import gql from "graphql-tag";
import { IncomingMessage, ServerResponse } from "http";
import microCors from "micro-cors";
import mongoose from "mongoose";
import { resolvers, typeDefs } from "./merger";

mongoose.Promise = global.Promise;

const url = process.env.mongodb_url;
if (url == null) {
  throw new Error("mongodb_url secret is not defined.");
}
mongoose.set("bufferCommands", false);
mongoose.set("debug", true);
mongoose.connect(url, { useNewUrlParser: true });
// tslint:disable-next-line no-console
mongoose.connection.once("open", () => console.log(`Connected to mongo at ${url}`));

const defaultQuery = gql`query comics {
  syndications {
    title
  }
}`;

const apolloServer = new ApolloServer({
  introspection: true,
  playground: {
    tabs: [
      {
        endpoint: process.env.graphql_http_endpoint,
        query: defaultQuery,
      },
    ],
  },
  typeDefs,
  resolvers,
  formatError: (error: any) => {
    // tslint:disable-next-line no-console
    console.error(error);
    return error;
  },
  formatResponse: (response: any) => {
    // tslint:disable-next-line no-console
    console.log(response);
    return response;
  },
});

const cors = microCors();

const handleOptions = (handler: any) => (req: IncomingMessage, res: ServerResponse, ...args: any) => {
  if (req.method === "OPTIONS") {
  // add required headers here
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
    res.end();
  } else {
    return handler(req, res, ...args);
  }
};

export default cors(handleOptions(apolloServer.createHandler()));
