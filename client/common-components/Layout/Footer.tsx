import * as React from "react";
import { LinkList } from "../LinkList/LinkList";
import styles from "./Footer.module.scss";
import { format } from "date-fns";

interface Props {}

export const Footer: React.FunctionComponent<Props> = () => (
  <footer className={styles.footer}>
    <nav className={styles.footerNav}>
      <LinkList
        elements={[
          {
            content: `© ${format(new Date(), "yyyy")} Inbox Comics`,
            key: "copyright",
          },
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
