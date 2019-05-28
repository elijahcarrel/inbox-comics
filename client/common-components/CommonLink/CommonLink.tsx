import Link from "next/link";
import * as React from "react";
import styles from "./CommonLink.module.scss";

interface Props {
  href: string;
  children: React.ReactNode;
}

export const CommonLink: React.FunctionComponent<Props> = ({ href, children }) => (
  <Link
    href={href}
  >
    <a className={styles.link}>{children}</a>
  </Link>
);
