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
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
}

export const Button: React.FunctionComponent<Props> = (props: Props) => {
  const {
    href,
    onClick,
    children,
    className,
    uppercase = false,
    disabled = false,
    type = "button",
  } = props;
  const innerButton = (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={classNames(className, styles.button, {
        [styles.uppercase]: uppercase,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
  if (href) {
    return <Link href={href} legacyBehavior>{innerButton}</Link>;
  }
  return innerButton;
};
