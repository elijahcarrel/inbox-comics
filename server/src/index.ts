import { ApolloServer } from "apollo-server-micro";
import mongoose from "mongoose";
import { resolvers, typeDefs } from "./merger";

mongoose.Promise = global.Promise;

const url = process.env.NODE_ENV === "production" ? process.env.mongodb_url : "mongodb://127.0.0.1:27017/ic";
if (url == null) {
  throw new Error("mongodb_url secret is not defined.");
}
mongoose.set("bufferCommands", false);
mongoose.set("debug", true);
mongoose.connect(url, { useNewUrlParser: true });
// tslint:disable-next-line no-console
mongoose.connection.once("open", () => console.log(`Connected to mongo at ${url}`));

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
        endpoint: process.env.NODE_ENV === "production" ?
          "https://api.inboxcomics.now.sh/graphql" :
          "http://localhost:3000/graphql",
        query: defaultQuery,
      },
    ],
  },
  typeDefs,
  resolvers,
});

export default apolloServer.createHandler();
