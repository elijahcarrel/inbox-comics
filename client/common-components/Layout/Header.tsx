import React from "react";
import { CommonLink } from "../CommonLink/CommonLink";
import { LinkList } from "../LinkList/LinkList";
import { Logo } from "../Logo/Logo";
import styles from "./Header.module.scss";

export const Header = () => (
  <div className={styles.topBar}>
    <div className={styles.logoContainer}>
      <CommonLink href="/" lowercase><Logo className={styles.logo} /></CommonLink>
    </div>
    <div className={styles.spacerElement}>{}</div>
    <div className={styles.menuContainer}>
      <header>
        <nav>
          <LinkList
            elements={[
              {
                href: "/enter-email",
                content: "Sign Up",
              },
              {
                href: "/enter-email",
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
