import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import fetch from "isomorphic-unfetch";
import App from "next/app";
import React from "react";
// TODO(ecarrel): remove the eslint-disable directive once https://github.com/vercel/analytics/issues/18 is resolved.
// eslint-disable-next-line import/no-unresolved
import { Analytics } from "@vercel/analytics/react";
import { ToasterContainer } from "../common-components/ToasterContainer/ToasterContainer";

const graphQLHttpEndpoint = "/api/graphql";

class MyApp extends App {
  public render() {
    const { Component, pageProps } = this.props;

    const client = new ApolloClient({
      link: new HttpLink({
        uri: graphQLHttpEndpoint,
        credentials: "same-origin",
        fetch: !process.browser ? fetch : undefined, // Use fetch() polyfill on the server
      }),
      cache: new InMemoryCache(),
    });

    return (
      <ApolloProvider client={client}>
        <Component {...pageProps} />
        <Analytics />
        <ToasterContainer />
      </ApolloProvider>
    );
  }
}

export default MyApp;
