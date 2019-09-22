import Head from "next/head";
import React, { Fragment } from "react";
import { LoadingOverlay } from "../LoadingOverlay/LoadingOverlay";
import { H1 } from "../H1/H1";
import { Footer } from "./Footer";
import { Header } from "./Header";
import styles from "./Layout.module.scss";

interface Props {
  title?: string;
  showTitle?: boolean;
  isLoading?: boolean;
  error?: string;
  children?: React.ReactNode;
}

export const Layout: React.FunctionComponent<Props> = (props: Props) => {
  const {
    children,
    title,
    showTitle = true,
    isLoading = false,
    error,
  } = props;
  return (
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
            {error ? <div className={styles.error}>{error}</div> :
              <Fragment>
                {showTitle && (
                  <H1>{title}</H1>
                )}
                {isLoading && <LoadingOverlay />}
                {!isLoading && (
                  <Fragment>
                    {children}
                  </Fragment>
                )}
              </Fragment>
            }
          </div>
          <Footer />
        </div>
      </div>
    </Fragment>
  );
};
