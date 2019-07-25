import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import App, { Container } from "next/app";
import Router from "next/router";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { withApolloClient } from "../lib/with-apollo-client";

// Workaround to fix https://github.com/zeit/next-plugins/issues/282.
Router.events.on("routeChangeComplete", () => {
  if (process.env.NODE_ENV !== "production") {
    const els = document.querySelectorAll('link[href*="/_next/static/css/styles.chunk.css"]');
    const timestamp = new Date().valueOf();
    // @ts-ignore href does not exist on element.
    els[0].href = "/_next/static/css/styles.chunk.css?v=" + timestamp;
  }
});

interface Props {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

class MyApp extends App<Props> {
  public render() {
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

// @ts-ignore TODO(ecarrel): fix weird type error.
export default withApolloClient(MyApp);
