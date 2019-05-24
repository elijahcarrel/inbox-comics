import App, { Container } from "next/app";
import React from "react";
import { ApolloProvider } from "react-apollo";
import withApolloClient from "../lib/with-apollo-client";

class MyApp extends App {
  public render() {
    // @ts-ignore TODO
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
