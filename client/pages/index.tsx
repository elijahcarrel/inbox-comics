import * as React from "react";
import { Layout } from "../common-components/Layout/Layout";
import { Title } from "../common-components/Title/Title";

const IndexPage: React.FunctionComponent = () => {
  return (
    <Layout title="Home">
      <Title>Home</Title>
      <p>Welcome to Inbox Comics!</p>
    </Layout>
  );
};

export default IndexPage;
