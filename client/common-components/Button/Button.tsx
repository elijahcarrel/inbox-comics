import classNames from "classnames";
import Link from "next/link";
import * as React from "react";
import styles from "./Button.module.scss";

export interface Props {
  href?: string;
  children: React.ReactNode;
  uppercase?: boolean;
  onClick?: () => any;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FunctionComponent<Props> = (props: Props) => {
  const {
    href,
    onClick,
    children,
    className,
    uppercase = false,
    disabled = false,
  } = props;
  const innerButton = (
    <button
      type="button"
      className={classNames(className, styles.button, {[styles.uppercase]: uppercase})}
      onClick={onClick}
      disabled={disabled}
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
