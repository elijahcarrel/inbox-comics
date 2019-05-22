import Link from "next/link";
import * as React from "react";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import Layout from "../common-components/Layout/Layout";

const AboutPage: React.FunctionComponent = () => (
  <Layout title="About | Next.js + TypeScript Example">
    <h1>About</h1>
    <p>
      This is Inbox Comics v2 prototype.
      Go to the <CommonLink href="http://www.inboxcomics.com/">real site</CommonLink>.
    </p>
    <p><Link href="/"><a>Go home</a></Link></p>
  </Layout>
);

export default AboutPage;
