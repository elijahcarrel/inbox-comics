import classNames from "classnames";
import Link from "next/link";
import * as React from "react";
import styles from "./CommonLink.module.scss";

interface Props {
  href?: string;
  onClick?: () => any;
  children: React.ReactNode;
  lowercase?: boolean;
  underline?: boolean;
  className?: string;
  isExternal?: boolean;
}

export const CommonLink = (props: Props) => {
  const {
    href,
    children,
    lowercase = false,
    underline = true,
    className = "",
    isExternal = false,
    onClick,
  } = props;
  let aProps = {};
  if (isExternal) {
    aProps = {
      ...aProps,
      href,
      target: "_blank",
    };
  }
  const innerLink = (
    <a
      className={classNames(styles.link,
        {[styles.uppercase]: !lowercase},
        {[styles.noUnderline]: !underline},
        className,
      )}
      onClick={onClick && onClick}
      {...aProps}
    >
      {children}
    </a>
  );
  if (!href || isExternal) {
    return innerLink;
  }
  return (
    <Link
      href={href}
    >
      {innerLink}
    </Link>
  );
};
