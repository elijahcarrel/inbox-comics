import Head from "next/head";
import React, { Fragment } from "react";
import { Title } from "../Title/Title";
import { Footer } from "./Footer";
import { Header } from "./Header";
import styles from "./Layout.module.scss";

interface Props {
  title?: string;
  showTitle?: boolean;
}

export const Layout: React.FunctionComponent<Props> = ({ children, title, showTitle = true }) => (
  <Fragment>
    <Head>
      <title>{title ? `Inbox Comics | ${title}` : "Inbox Comics"}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div className={styles.bodyContainer}>
      <div className={styles.body}>
        <Header />
        <div className={styles.content}>
          {showTitle && (
            <Title>{title}</Title>
          )}
          {children}
        </div>
        <Footer />
      </div>
    </div>
  </Fragment>
);
