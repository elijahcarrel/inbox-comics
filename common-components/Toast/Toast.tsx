import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { DefaultToast } from "react-toast-notifications";
import styles from "./Toast.module.scss";

interface Props {
  children: React.ReactNode;
}

export const Toast = (props: Props) => {
  const { children, ...otherProps } = props;
  return (
    <div className={styles.toastContainer}>
      <DefaultToast className={styles.toast} {...otherProps}>
        <span className={styles.innerToast}>{children}</span>
      </DefaultToast>
    </div>
  );
};
