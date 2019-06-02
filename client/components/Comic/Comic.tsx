import classNames from "classnames";
import React from "react";
import styles from "./Comic.module.scss";

interface Props {
  title: string;
  identifier: string;
  classes?: {
    comicContainer?: string;
    comicLogo?: string;
  };
  isSelected: boolean;
  onClick: () => any;
}

export const Comic = (props: Props) => {
  const { title, identifier, classes = {}, isSelected, onClick } = props;
  return (
    <div
      className={classNames(styles.comicContainer, classes.comicContainer, {
        [styles.selected]: isSelected,
      })}
      onClick={onClick}
    >
      <img
        className={classNames(styles.comicLogo, classes.comicLogo)}
        src={`/static/images/logos/${identifier}.jpg`}
        alt=""
      />
      <span className={styles.comicTitleText}>
        {title}
      </span>
    </div>
  );
};
