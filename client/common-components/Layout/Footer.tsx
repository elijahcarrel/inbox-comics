import moment from "moment";
import * as React from "react";
import { LinkList } from "../LinkList/LinkList";
import styles from "./Footer.module.scss";

interface Props {}

export const Footer: React.FunctionComponent<Props> = () => (
  <footer className={styles.footer}>
    <nav className={styles.footerNav}>
      <LinkList
        elements={[
          {
            content: `© ${moment().year()} Inbox Comics`,
          },
          {
            href: "/",
            content: "Home",
          },
          {
            href: "/about",
            content: "About",
          },
        ]}
      />
    </nav>
  </footer>
);
