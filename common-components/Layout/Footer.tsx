import * as React from "react";
import { CommonLink } from '../CommonLink/CommonLink';
import styles from './Footer.module.scss';

type Props = {}

export const Footer: React.FunctionComponent<Props> = () => (
  <footer className={styles.footer}>
    <nav>
      <CommonLink href='/faq'>FAQ</CommonLink> | {' '}
      <CommonLink href='/news'>News</CommonLink> | {' '}
      <CommonLink href='/about'>About</CommonLink> | {' '}
      <CommonLink href='/contact'>Contact</CommonLink> | {' '}
    </nav>
  </footer>
);
