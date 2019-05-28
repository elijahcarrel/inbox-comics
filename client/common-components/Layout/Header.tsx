import React from "react";
import { CommonLink } from "../CommonLink/CommonLink";
import { LinkList } from "../LinkList/LinkList";
import { Logo } from "../Logo/Logo";
import styles from "./Header.module.scss";

export const Header = () => (
  <div className={styles.topBar}>
    <div className={styles.logoContainer}>
      <CommonLink href="/"><Logo className={styles.logo} /></CommonLink>
    </div>
    <div className={styles.spacerElement}>{}</div>
    <div className={styles.menuContainer}>
      <header>
        <nav>
          <LinkList
            elements={[
              {
                href: "/subscribe",
                content: "Subscribe",
              },
              {
                href: "/subscribe?modifySubscriptions",
                content: "My Subscriptions",
              },
            ]}
            classes={{
              element: styles.linkListElement,
            }}
          />
        </nav>
      </header>
    </div>
  </div>
);
