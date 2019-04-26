import * as React from 'react'
import { CommonLink } from '../CommonLink/CommonLink';
import { Footer } from './Footer';
import Head from 'next/head'

type Props = {
  title?: string,
}

const Layout: React.FunctionComponent<Props> = ({ children, title = 'This is the default title' }) => (
  <div>
    <Head>
      <title>Inbox Comics | {title}</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
    <header>
      <nav>
        <CommonLink href='/'>Home</CommonLink> | {' '}
        <CommonLink href='/list-class'>List Example</CommonLink> | {' '}
        <CommonLink href='/list-fc'>List Example (as Functional Component)</CommonLink> | {' '}
        <CommonLink href='/about'>About</CommonLink> | {' '}
      </nav>
    </header>
    {children}
    <Footer />
  </div>
)

export default Layout
