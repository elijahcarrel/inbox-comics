import classNames from "classnames";
import React, { useRef } from "react";
import Image from "next/image";
import { useDrag, useDrop, DropTargetMonitor, XYCoord } from "react-dnd";
import { mdiDragHorizontalVariant } from "@mdi/js";
import Icon from "@mdi/react";
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
  onMoveCard: (dragIndex: number, hoverIndex: number) => void;
  onDropCard: (didDrop: boolean) => void;
  index: number;
}

interface DragItem {
  index: number;
  identifier: string;
  type: string;
}

export const ItemTypes = {
  CARD: "card",
};

export const SyndicationCard = (props: Props) => {
  const {
    title,
    identifier,
    classes = {},
    isSelected,
    onClick,
    onMoveCard,
    onDropCard,
    index,
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Don't let self get replaced if it's not selected.
      if (!isSelected) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get horizontal middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the left.
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      // Only perform the move when the mouse has crossed half of the items width.
      // When dragging rightwards, only move when the cursor is beyond 50%
      // When dragging leftwards, only move when the cursor is before 50%

      // Dragging rightwards
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging leftwards
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      onMoveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
    canDrop: () => isSelected,
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id: identifier, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (_, monitor) => onDropCard(monitor.didDrop()),
    canDrag: isSelected,
  });

  drop(preview(ref));

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={classNames(
        styles.syndicationContainer,
        classes.syndicationContainer,
        {
          [styles.selected]: isSelected,
          [styles.isDragging]: isDragging,
        },
      )}
      onClick={onClick}
      ref={ref}
      data-handler-id={handlerId}
    >
      <div
        ref={drag}
        data-handler-id={handlerId}
        className={classNames(styles.dragIcon, {
          [styles.isDragIconVisible]: isSelected,
        })}
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
