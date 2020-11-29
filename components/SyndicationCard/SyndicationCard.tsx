import classNames from "classnames";
import React from "react";
import Image from "next/image";
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
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={classNames(
        styles.syndicationContainer,
        classes.syndicationContainer,
        {
          [styles.selected]: isSelected,
        },
      )}
      onClick={onClick}
    >
      <Image
        className={classNames(styles.syndicationLogo, classes.syndicationLogo)}
        src={`/static/images/logos/${identifier}.jpg`}
        alt=""
        width="100"
        height="100"
      />
      <span className={styles.syndicationTitleText}>{title}</span>
    </div>
  );
};
