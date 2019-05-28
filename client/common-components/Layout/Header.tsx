import React from "react";
import { CommonLink } from "../CommonLink/CommonLink";
import { Logo } from "../Logo/Logo";
import styles from "./Header.module.scss";

export const Header = () => (
  <div className="topbar clearfix">
    <a href="/" className={styles.logo}><Logo /></a>
    <div className="menu flex-list">
      <ul>
        <li><CommonLink href="/subscribe">Subscribe</CommonLink></li>
        <li><CommonLink href="/subscribe?modifySubscriptions">My Subscriptions</CommonLink></li>
      </ul>
    </div>
  </div>
);
