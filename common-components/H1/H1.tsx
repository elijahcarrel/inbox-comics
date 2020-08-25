import classNames from "classnames";
import React from "react";
import styles from "./H1.module.scss";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const H1 = (props: Props) => {
  const { children, className = "" } = props;
  return <h1 className={classNames(styles.h1, className)}>{children}</h1>;
};
