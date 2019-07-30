import classNames from "classnames";
import React from "react";
// @ts-ignore
import SquareLoader from "react-spinners/SquareLoader";
import styles from "./LoadingOverlay.module.scss";

interface Props {
  className?: string;
}

export const LoadingOverlay = (props: Props) => {
  const { className = "" } = props;
  return (
    <div className={classNames(className, styles.container)}>
      <SquareLoader
        sizeUnit="px"
        size={100}
        color="#ba0106"
        loading={true}
        {...props}
      />
    </div>
  );
};
