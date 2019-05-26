import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import fetch from "isomorphic-unfetch";

// @ts-ignore
let apolloClient = null;

const graphQLEndpoint = process.env.NODE_ENV === "production" ?
  "https://api.inboxcomics.now.sh/graphql" :
  "http://localhost:3000/graphql";

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

function create(initialState: any) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    // @ts-ignore
    connectToDevTools: process.browser,
    // @ts-ignore
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    // @ts-ignore
    link: new HttpLink({
      uri: graphQLEndpoint, // Server URL (must be absolute)
      credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
      // Use fetch() polyfill on the server
      // @ts-ignore
      fetch: !process.browser && fetch,
    }),
    cache: new InMemoryCache().restore(initialState || {}),
    defaultOptions,
  });
}

// @ts-ignore
export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  // @ts-ignore
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  // @ts-ignore
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  // @ts-ignore
  return apolloClient;
}
