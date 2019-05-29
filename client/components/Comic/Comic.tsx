import classNames from "classnames";
import React, { useState } from "react";
import styles from "./Comic.module.scss";

interface Props {
  title: string;
  identifier: string;
  classes?: {
    comicContainer?: string;
    comicLogo?: string;
  };
  // TODO(ecarrel): don't ignore this prop.
  isSelected: boolean;
}

export const Comic = (props: Props) => {
  const { title, identifier, classes = {} } = props;
  // TODO(ecarrel): move isSelected handling to parent.
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div
      className={classNames(styles.comicContainer, classes.comicContainer, {
        [styles.selected]: isSelected,
      })}
      onClick={() => setIsSelected(!isSelected)}
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
