import classNames from "classnames";
import React from "react";
import styles from "./Subtitle.module.scss";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Subtitle = (props: Props) => {
  const { children, className = "" } = props;
  return (
    <h2 className={classNames(styles.subtitle, className)}>
      {children}
    </h2>
  );
};
