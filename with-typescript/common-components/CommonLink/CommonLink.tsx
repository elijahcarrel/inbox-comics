import * as React from "react";
import Link from 'next/link'
import styles from './CommonLink.module.scss';

type Props = {
  href: string,
  children: React.ReactNode,
};

export const CommonLink: React.FunctionComponent<Props> = ({ href, children }) => (
  <Link
    href={href}
  >
    <a className={styles.a}>{children}</a>
  </Link>
);
