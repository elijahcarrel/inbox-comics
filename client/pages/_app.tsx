import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import fetch from "isomorphic-unfetch";
import App, { Container } from "next/app";
import React from "react";
import styles from "./app.module.scss";

// TODO(ecarrel): put these in env variables rather than hardcoding.
const graphQLHttpEndpoint = process.env.NODE_ENV === "production" ?
  "https://api.inboxcomics.now.sh/graphql" :
  "http://localhost:3000/graphql";

class MyApp extends App {
  public render() {
    const { Component, pageProps } = this.props;

    const client = new ApolloClient({
      link: new HttpLink({
        uri: graphQLHttpEndpoint,
        credentials: "same-origin",
        fetch: (!process.browser ? fetch: undefined), // Use fetch() polyfill on the server
      }),
      cache: new InMemoryCache(),
    });

    return (
      <Container>
        <ApolloProvider client={client}>
          {/* We need to reference styles.nothing somewhere to fix
           https://github.com/zeit/next-plugins/issues/282. */}
          <Component fakeProp={styles.nothing} {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default MyApp;
