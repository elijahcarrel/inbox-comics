import classNames from "classnames";
import React from "react";
import styles from "./SyndicationCard.module.scss";

interface Props {
  title: string;
  identifier: string;
  classes?: {
    syndicationContainer?: string;
    syndicationLogo?: string;
  };
  isSelected: boolean;
  onClick: () => any;
}

export const SyndicationCard = (props: Props) => {
  const { title, identifier, classes = {}, isSelected, onClick } = props;
  return (
    <div
      className={classNames(styles.syndicationContainer, classes.syndicationContainer, {
        [styles.selected]: isSelected,
      })}
      onClick={onClick}
    >
      <img
        className={classNames(styles.syndicationLogo, classes.syndicationLogo)}
        src={`/static/images/logos/${identifier}.jpg`}
        alt=""
      />
      <span className={styles.syndicationTitleText}>
        {title}
      </span>
    </div>
  );
};
