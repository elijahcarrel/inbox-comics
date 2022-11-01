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
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import {
  DndProvider,
  TouchTransition,
  MouseTransition,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore types not provided :(.
} from "react-dnd-multi-backend";
import { Toast } from "../common-components/Toast/Toast";
import styles from "./app.module.scss";
import { HTML5toTouch } from 'rdndmb-html5-to-touch'

// TODO(ecarrel): for some reason, the HTML5toTouch provided by
//  rdndmb-html5-to-touch doesn't work, and so we have to create it ourselves.
//  Once the fix is upstreamed, use the upstream version.
// TODO(ecarrel): determine a minimal repro of the problem and file a GitHub
//  issue. The bug presents as:
// Error: You must specify a valid 'transition' property (either undefined or
// the return of 'createTransition') in your Backend entry: [object Object]
// const HTML5toTouch2 = {
//   backends: [
//     {
//       id: "html5",
//       backend: HTML5Backend,
//       transition: MouseTransition,
//     },
//     {
//       id: "touch",
//       backend: TouchBackend,
//       options: { enableMouseEvents: true },
//       preview: true,
//       transition: TouchTransition,
//     },
//   ],
// };

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
        <DndProvider options={HTML5toTouch}>
          <ApolloProvider client={client}>
            {/* We need to reference styles.nothing somewhere to fix
             https://github.com/zeit/next-plugins/issues/282. */}
            <Component fakeProp={styles.nothing} {...pageProps} />
          </ApolloProvider>
        </DndProvider>
      </ToastProvider>
    );
  }
}

export default MyApp;
