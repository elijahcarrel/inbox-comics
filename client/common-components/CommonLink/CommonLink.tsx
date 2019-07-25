import classNames from "classnames";
import Link from "next/link";
import * as React from "react";
import styles from "./CommonLink.module.scss";

interface Props {
  href: string;
  children: React.ReactNode;
  lowercase?: boolean;
  underline?: boolean;
}

export const CommonLink: React.FunctionComponent<Props> = (props: Props) => {
  const { href, children, lowercase = false, underline = true } = props;
  return (
    <Link
      href={href}
    >
      <a className={classNames(styles.link,
        {[styles.uppercase]: !lowercase},
        {[styles.noUnderline]: !underline},
      )}>{children}</a>
    </Link>
  );
};
