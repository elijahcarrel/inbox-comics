import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import fetch from "isomorphic-unfetch";
import App from "next/app";
import React from "react";
import { ToastProvider } from "react-toast-notifications";
import { Toast } from "../common-components/Toast/Toast";
import styles from "./app.module.scss";

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
      <ToastProvider components={{ Toast }}>
        <ApolloProvider client={client}>
          {/* We need to reference styles.nothing somewhere to fix
           https://github.com/zeit/next-plugins/issues/282. */}
          <Component fakeProp={styles.nothing} {...pageProps} />
        </ApolloProvider>
      </ToastProvider>
    );
  }
}

export default MyApp;
