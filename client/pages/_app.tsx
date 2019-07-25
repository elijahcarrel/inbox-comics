import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import App, { Container } from "next/app";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { withApolloClient } from "../lib/with-apollo-client";
import styles from "./app.module.scss";

interface Props {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

class MyApp extends App<Props> {
  public render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          {/* We need to reference styles.nothing somewhere to fix https://github.com/zeit/next-plugins/issues/282. */}
          <Component fakeProp={styles.nothing} {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

// @ts-ignore TODO(ecarrel): fix weird type error.
export default withApolloClient(MyApp);
