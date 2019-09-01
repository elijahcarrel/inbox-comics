import * as React from "react";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { Layout } from "../common-components/Layout/Layout";

const IndexPage: React.FunctionComponent = () => {
  return (
    <Layout title="Home">
      <p>
        This is the Inbox Comics v2 prototype.
        Go to the <CommonLink href="http://www.inboxcomics.com/" lowercase isExternal>current site</CommonLink>.
      </p>
    </Layout>
  );
};

export default IndexPage;
