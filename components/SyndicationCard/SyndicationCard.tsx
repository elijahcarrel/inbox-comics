import classNames from "classnames";
import React from "react";
import Image from "next/image";
import { mdiDragHorizontalVariant } from "@mdi/js";
import Icon from "@mdi/react";
import styles from "./SyndicationCard.module.scss";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  title: string;
  identifier: string;
  classes?: {
    syndicationContainer?: string;
    syndicationLogo?: string;
  };
  isSelected: boolean;
  onClick: () => any;
  index: number;
}

export const SyndicationCard = (props: Props) => {
  const {
    title,
    identifier,
    classes = {},
    isSelected,
    onClick,
  } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: identifier });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
      style={style}
      ref={setNodeRef}
      onClick={onClick}
    >
      <div
        className={classNames(styles.dragIcon, {
          [styles.isDragIconVisible]: isSelected,
        })}
        {...attributes}
        {...listeners}
      >
        <Icon path={mdiDragHorizontalVariant} size={1} />
      </div>
      <div className={styles.syndicationContainerLogoAndText}>
        <Image
          className={classNames(
            styles.syndicationLogo,
            classes.syndicationLogo,
          )}
          src={`/static/images/logos/${identifier}.jpg`}
          alt=""
          width="100"
          height="100"
        />
        <span className={styles.syndicationTitleText}>{title}</span>
      </div>
    </div>
  );
};
