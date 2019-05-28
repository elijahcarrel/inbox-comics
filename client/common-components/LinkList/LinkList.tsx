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
    href?: string;
    content: string;
    className?: string;
  }>;
}

export const LinkList = (props: Props) => {
  const { classes = {}, elements } = props;
  return (
    <div className={classNames(styles.flexList, classes.container)}>
      <ul className={classes.list || ""}>
        {elements.map(({ href, content, className }) => (
            <li className={classNames(className, classes.element)}>
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
