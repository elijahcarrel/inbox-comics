import * as React from "react";
import { CommonLink } from "../CommonLink/CommonLink";
import styles from "./Footer.module.scss";

interface Props {}

export const Footer: React.FunctionComponent<Props> = () => (
  <footer className={styles.footer}>
    <nav>
      <CommonLink href="/">Home</CommonLink> | {" "}
      <CommonLink href="/about">About</CommonLink> | {" "}
    </nav>
  </footer>
);
