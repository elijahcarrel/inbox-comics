import Head from "next/head";
import React from "react";
import { getDataFromTree } from "react-apollo";
import initApollo from "./init-apollo";

// @ts-ignore
export default (App) => {
  return class Apollo extends React.Component {
    public static displayName = "withApollo(App)";
    // @ts-ignore
    public static async getInitialProps(ctx) {
      const { Component, router } = ctx;

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      // @ts-ignore
      const apollo = initApollo();
      // @ts-ignore
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

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState,
      };
    }

    // @ts-ignore
    constructor(props) {
      super(props);
      // @ts-ignore
      this.apolloClient = initApollo(props.apolloState);
    }

    public render() {
      // @ts-ignore
      return <App {...this.props} apolloClient={this.apolloClient} />;
    }
  };
};
