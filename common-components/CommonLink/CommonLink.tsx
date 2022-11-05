import classNames from "classnames";
import Link from "next/link";
import * as React from "react";
import styles from "./CommonLink.module.scss";

interface Props {
  href?: string;
  onClick?: () => any;
  children: React.ReactNode;
  uppercase?: boolean;
  underline?: boolean;
  className?: string;
  isExternal?: boolean;
  InnerLinkComponent?: React.ComponentType<any>;
  isLink?: boolean;
}

export const CommonLink = (props: Props) => {
  const {
    href,
    children,
    uppercase = false,
    underline = true,
    className = "",
    isExternal = false,
    InnerLinkComponent,
    isLink = true,
    onClick,
  } = props;
  if (!isLink) {
    return <span className={className}>{children}</span>;
  }
  let innerLinkProps: Record<string, any> = {
    className: classNames(
      styles.link,
      { [styles.uppercase]: uppercase },
      { [styles.noUnderline]: !underline },
      className,
    ),
    onClick: onClick && onClick,
  };
  if (isExternal) {
    innerLinkProps = {
      ...innerLinkProps,
      href,
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }
  const innerLink =
    InnerLinkComponent == null ? (
      <a {...innerLinkProps}>{children}</a>
    ) : (
      <InnerLinkComponent {...innerLinkProps}>{children}</InnerLinkComponent>
    );
  if (!href || isExternal) {
    return innerLink;
  }
  return <Link href={href} legacyBehavior>{innerLink}</Link>;
};
