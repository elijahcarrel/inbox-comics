import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
// @ts-ignore TODO(ecarrel): not sure why no types for these
import { AppComponentType, AppProps, DefaultAppIProps, NextAppContext } from "next/app";
import Head from "next/head";
import React from "react";
import { getDataFromTree } from "react-apollo";
import { initApollo } from "./init-apollo";

type ApolloAppProps = {
  apolloState?: NormalizedCacheObject;
} & AppProps & DefaultAppIProps;

type WithApolloClientProps = AppComponentType<{
  apolloClient: ApolloClient<NormalizedCacheObject>;
}>;

export const withApolloClient = (App: WithApolloClientProps) => {
  return class Apollo extends React.Component<ApolloAppProps> {
    public static displayName = "withApollo(App)";
    public static async getInitialProps(nextContext: NextAppContext): Promise<ApolloAppProps> {
      const { Component, router } = nextContext;

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(nextContext);
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apollo = initApollo();
      if (!process.browser) {
        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apollo}
            />,
          );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          // tslint:disable-next-line no-console
          console.error("Error while running `getDataFromTree`", error);
        }

        // getDataFromTree does not call componentWillUnmount.
        // Head side effect therefore needs to be cleared manually.
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract();

      // @ts-ignore: appProps contains the necessary props but we can't prove this to typescript.
      return {
        ...appProps,
        apolloState,
      };
    }
    private readonly apolloClient: ApolloClient<NormalizedCacheObject>;

    constructor(props: ApolloAppProps) {
      super(props);
      this.apolloClient = initApollo(props.apolloState);
    }

    public render() {
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
};
