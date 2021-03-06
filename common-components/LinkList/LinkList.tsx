import classNames from "classnames";
import React from "react";
import { CommonLink } from "../CommonLink/CommonLink";
import styles from "./LinkList.module.scss";

interface Props {
  classes?: {
    container?: string;
    list?: string;
    element?: string;
  };
  elements: {
    key: string;
    href?: string;
    content: string;
    className?: string;
    onClick?: () => any;
  }[];
  wrapWidth: "wide" | "medium" | "none";
}

export const LinkList = (props: Props) => {
  const { classes = {}, elements, wrapWidth = "wide" } = props;
  const wrapStyles = {
    none: styles.wrapNone,
    medium: styles.wrapMedium,
    wide: styles.wrapWide,
  };
  const wrapStyle = wrapStyles[wrapWidth];
  if (wrapStyle == null) {
    throw new Error("Invalid wrap width.");
  }
  return (
    <div className={classNames(styles.flexList, classes.container)}>
      <ul className={classNames(classes.list, wrapStyle)}>
        {elements.map(({ href, content, className, key, onClick }) => (
          <li
            className={classNames(className, classes.element, wrapStyle)}
            key={key}
          >
            {href || onClick ? (
              <CommonLink href={href} onClick={onClick} uppercase>
                {content}
              </CommonLink>
            ) : (
              <>{content}</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
