import classNames from "classnames";
import React from "react";
import styles from "./H3.module.scss";

interface Props {
  children: React.ReactNode;
  className?: string;
  bold?: boolean;
}

export const H3 = (props: Props) => {
  const { children, className = "", bold = false } = props;
  return (
    <h3 className={classNames(styles.h3, {
      [styles.bold]: bold,
    }, className)}>
      {children}
    </h3>
  );
};
