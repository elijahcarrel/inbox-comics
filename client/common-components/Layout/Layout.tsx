import Head from "next/head";
import * as React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import styles from "./Layout.module.scss";

interface Props {
  title?: string;
}

export const Layout: React.FunctionComponent<Props> = ({ children, title }) => (
  <div className={styles.body}>
    <Head>
      <title>{title ? `Inbox Comics | ${title}` : "Inbox Comics"}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav>
        <Header />
      </nav>
    </header>
    {children}
    <Footer />
  </div>
);
