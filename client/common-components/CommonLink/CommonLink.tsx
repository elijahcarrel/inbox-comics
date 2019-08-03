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
}

export const CommonLink = (props: Props) => {
  const {
    href,
    children,
    lowercase = false,
    underline = true,
    className = "",
    onClick,
  } = props;
  const innerLink = (
    <a
      className={classNames(styles.link,
        {[styles.uppercase]: !lowercase},
        {[styles.noUnderline]: !underline},
        className,
      )}
      onClick={onClick && onClick}
    >
      {children}
    </a>
  );
  if (href) {
    return (
      <Link
        href={href}
      >
        {innerLink}
      </Link>
    );
  }
  return innerLink;
};
