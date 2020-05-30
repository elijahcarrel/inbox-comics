import classNames from "classnames";
import React from "react";
import { Button, Props as ButtonProps } from "../Button/Button";
import styles from "./CallToAction.module.scss";

type Props = {
  children: React.ReactNode;
  isSticky: boolean;
} & ButtonProps;

export const CallToAction = (props: Props) => {
  const { children, isSticky, ...otherProps } = props;
  return (
    <div className={classNames(styles.outerButtonContainer, {
      [styles.isSticky]: isSticky,
    })}>
      <div className={styles.faderElement} />
      <div className={styles.innerButtonContainer}>
        <Button
          className={styles.button}
          {...otherProps}
        >
          {children}
        </Button>
      </div>
    </div>
  );
};
