import classNames from "classnames";
import React, { Fragment } from "react";
import { CommonLink } from "../CommonLink/CommonLink";
import styles from "./LinkList.module.scss";

interface Props {
  classes?: {
    container?: string;
    list?: string;
    element?: string;
  };
  elements: Array<{
    key: string,
    href?: string;
    content: string;
    className?: string;
  }>;
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
        {elements.map(({ href, content, className, key }) => (
          <li
            className={classNames(className, classes.element, wrapStyle)}
            key={key}
          >
            {href ? (
                <CommonLink href={href}>{content}</CommonLink>
              ) : (
                <Fragment>
                  {content}
                </Fragment>
              )
            }
          </li>
          ))}
      </ul>
    </div>
  );
};
