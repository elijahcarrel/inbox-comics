import classNames from "classnames";
import React from "react";
import styles from "./H2.module.scss";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const H2 = (props: Props) => {
  const { children, className = "" } = props;
  return (
    <h2 className={classNames(styles.h2, className)}>
      {children}
    </h2>
  );
};
