import classNames from "classnames";
import React from "react";
import styles from "./Title.module.scss";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Title = (props: Props) => {
  const { children, className = "" } = props;
  return (
    <h1 className={classNames(styles.title, className)}>
      {children}
    </h1>
  );
};
