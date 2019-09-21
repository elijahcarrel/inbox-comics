import classNames from "classnames";
import React from "react";
import styles from "./DynamicText.module.scss";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const DynamicText = (props: Props) => {
  const { children, className = "" } = props;
  return (
    <span className={classNames(styles.dynamicText, className)}>
      {children}
    </span>
  );
};
