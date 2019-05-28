import React from "react";
import styles from "./Header.module.scss";
import { Logo } from "./Logo";

export const Header = () => (
  <div className="topbar clearfix">
    <a href="/" className={styles.logo}><Logo /></a>
    <div className="menu flex-list">
      <ul>
        <li><a href="http://www.inboxcomics.com/subscribe.php">Sign Up</a></li>
        <li><a href="http://www.inboxcomics.com/subscribe.php?modifysettings">My Subscriptions</a></li>
      </ul>
    </div>
  </div>
);
