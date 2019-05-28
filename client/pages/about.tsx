import * as React from "react";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { Layout } from "../common-components/Layout/Layout";
import { ComicsList } from "../components/Comics";

const AboutPage: React.FunctionComponent = () => (
  <Layout title="About">
    <h1>About</h1>
    <p>
      This is Inbox Comics v2 prototype.
      Go to the <CommonLink href="http://www.inboxcomics.com/">real site</CommonLink>.
    </p>
    <p>
      Comics available are:
      <ComicsList />
    </p>
  </Layout>
);

export default AboutPage;
