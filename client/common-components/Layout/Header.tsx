import React from "react";
import { CommonLink } from "../CommonLink/CommonLink";
import { LinkList } from "../LinkList/LinkList";
import { Logo } from "../Logo/Logo";
import styles from "./Header.module.scss";

export const Header = () => {
  return (
    <div className={styles.topBar}>
      <div className={styles.logoContainer}>
        <CommonLink
          href="/"
          underline={false}

          className={styles.logoLink}
        >
          <Logo className={styles.logo} />
        </CommonLink>
      </div>
      <div className={styles.spacerElement}>{}</div>
      <div className={styles.menuContainer}>
        <header>
          <nav>
            <LinkList
              elements={[
                {
                  key: "sign-up",
                  content: "Sign Up",
                  href: "/user/new",
                },
                {
                  key: "edit-subscriptions",
                  content: "Edit Subscriptions",
                  href: "/user/edit",
                },
              ]}
              classes={{
                element: styles.linkListElement,
              }}
              wrapWidth="medium"
            />
          </nav>
        </header>
      </div>
    </div>
  );
};
