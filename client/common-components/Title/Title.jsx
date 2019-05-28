import React from "react";
import styles from "./Title.module.scss";

export const Title = (props) => {
  const { children } = props;
  return (
    <h1 className={styles.title}>
      {children}
    </h1>
  )
}