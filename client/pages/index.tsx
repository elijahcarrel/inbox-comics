import * as React from "react";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { Layout } from "../common-components/Layout/Layout";
import { Title } from "../common-components/Title/Title";

const IndexPage: React.FunctionComponent = () => {
  return (
    <Layout title="Home">
      <Title>Home</Title>
      <p>
        This is Inbox Comics v2 prototype.
        Go to the <CommonLink href="http://www.inboxcomics.com/" lowercase>current site</CommonLink>.
      </p>
    </Layout>
  );
};

export default IndexPage;
