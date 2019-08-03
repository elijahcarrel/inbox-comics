import Head from "next/head";
import React, { Fragment } from "react";
import { LoadingOverlay } from "../LoadingOverlay/LoadingOverlay";
import { Title } from "../Title/Title";
import { Footer } from "./Footer";
import { Header } from "./Header";
import styles from "./Layout.module.scss";
import { ToastAlerts } from "./ToastAlerts";

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
                  <Title>{title}</Title>
                )}
                {isLoading && <LoadingOverlay />}
                {!isLoading && (
                  <Fragment>
                    <ToastAlerts />
                    {children}
                  </Fragment>
                )}
              </Fragment>
            }
          </div>
          <Footer />
          <ToastAlerts />
        </div>
      </div>
    </Fragment>
  );
}
