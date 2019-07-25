import React from "react";
import styles from "./Subtitle.module.scss";

export const Subtitle = (props) => {
  const { children } = props;
  return (
    <h2 className={styles.subtitle}>
      {children}
    </h2>
  );
};
