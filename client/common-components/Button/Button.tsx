import classNames from "classnames";
import Link from "next/link";
import * as React from "react";
import styles from "./Button.module.scss";

interface Props {
  href?: string;
  children: React.ReactNode;
  lowercase?: boolean;
  onClick?: () => any;
  className?: string;
}

export const Button: React.FunctionComponent<Props> = (props: Props) => {
  const { href, onClick, children, className, lowercase = false } = props;
  const innerButton = (
    <button
      type="button"
      className={classNames(className, styles.button, {[styles.uppercase]: !lowercase})}
      onClick={onClick}
    >
      {children}
    </button>
  );
  if (href) {
    return (
      <Link
        href={href}
      >
        {innerButton}
      </Link>
    );
  }
  return innerButton;
};
