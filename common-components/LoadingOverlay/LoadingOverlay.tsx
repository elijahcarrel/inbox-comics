import classNames from "classnames";
import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PulseLoader from "react-spinners/PulseLoader";
import styles from "./LoadingOverlay.module.scss";

interface Props {
  className?: string;
}

export const LoadingOverlay = (props: Props) => {
  const { className = "" } = props;
  return (
    <div className={classNames(className, styles.container)}>
      <PulseLoader size="30px" color="#ba0106" loading {...props} />
    </div>
  );
};
