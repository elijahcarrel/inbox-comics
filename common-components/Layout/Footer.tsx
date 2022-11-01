import * as React from "react";
import toast from "react-hot-toast";
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
          {
            href: "/privacy",
            key: "privacy",
            content: "Privacy",
          },
          {
            onClick: () => toast.success("toast"),
            key: "toast",
            content: "Toast",
          },
          {
            onClick: () => toast.error("toast"),
            key: "toast-error",
            content: "Toast Error",
          },
        ]}
        wrapWidth="wide"
      />
    </nav>
  </footer>
);
