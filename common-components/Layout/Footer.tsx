import * as React from "react";
import { LinkList } from "../LinkList/LinkList";
import styles from "./Footer.module.scss";

export const Footer: React.FunctionComponent = () => (
  <footer className={styles.footer}>
    <nav className={styles.footerNav}>
      <LinkList
        elements={[
          {
            href: "/faq",
            key: "faq",
            content: "FAQ",
          },
          {
            href: "/news",
            key: "news",
            content: "News",
          },
          {
            href: "/contact",
            key: "contact",
            content: "Contact",
          },
          {
            href: "/about",
            key: "about",
            content: "About",
          },
        ]}
        wrapWidth="wide"
      />
    </nav>
  </footer>
);
