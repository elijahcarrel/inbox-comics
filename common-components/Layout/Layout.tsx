import Head from "next/head";
import Script from "next/script";
import React from "react";
import { H1 } from "../H1/H1";
import { LoadingOverlay } from "../LoadingOverlay/LoadingOverlay";
import { Footer } from "./Footer";
import { Header } from "./Header";
import styles from "./Layout.module.scss";

interface Props {
  title?: string;
  showTitle?: boolean;
  isLoading?: boolean;
  error?: string;
  errorAction?: React.ReactNode;
  children?: React.ReactNode;
}

export const Layout: React.FunctionComponent<Props> = (props: Props) => {
  const {
    children,
    title,
    showTitle = true,
    isLoading = false,
    error,
    errorAction = null,
  } = props;
  const siteTitle = "Inbox Comics";
  const displayTitle = title ? `${siteTitle} | ${title}` : siteTitle;
  const description =
    "Get your selection of over 400 comics, including Calvin and Hobbes and Peanuts, emailed to you every morning, completely free and never with any ads. Sign up now— it only takes a minute!";
  const googleTagId = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;
  if (googleTagId == null) {
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_TAG_ID environment variable is not defined.",
    );
  }
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleTagId}');
        `}
      </Script>
      <Head>
        <title>{displayTitle}</title>
        <meta name="twitter:title" content={displayTitle} />
        <meta name="og:title" content={displayTitle} />
        <meta name="application-name" content={siteTitle} />
        <meta property="og:site_name" content={siteTitle} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <link
          rel="icon"
          type="image/png"
          href="/static/images/favs/favicon-196x196.png"
          sizes="196x196"
        />
        <link
          rel="icon"
          type="image/png"
          href="/static/images/favs/favicon-128x128.png"
          sizes="128x128"
        />
        <link
          rel="icon"
          type="image/png"
          href="/static/images/favs/favicon-96x96.png"
          sizes="96x96"
        />
        <link
          rel="icon"
          type="image/png"
          href="/static/images/favs/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="/static/images/favs/favicon-16x16.png"
          sizes="16x16"
        />
        <meta
          property="og:image"
          content="https://www.inboxcomics.com/static/images/ogimage.png"
        />
        <meta
          name="twitter:image"
          content="https://www.inboxcomics.com/static/images/ogimage.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@inboxcomics" />
        <meta name="twitter:domain" content="https://www.inboxcomics.com/" />
        <meta name="twitter:site" content="@inboxcomics" />
      </Head>
      <div className={styles.bodyContainer}>
        <div className={styles.body}>
          <Header />
          <div className={styles.content}>
            {error ? (
              <>
                <div className={styles.error}>{error}</div>
                {errorAction}
              </>
            ) : (
              <>
                {showTitle && <H1>{title}</H1>}
                {isLoading && <LoadingOverlay />}
                {!isLoading && <>{children}</>}
              </>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};
