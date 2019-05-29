import * as React from "react";
import { Layout } from "../common-components/Layout/Layout";
import { Title } from "../common-components/Title/Title";
import { ComicGrid } from "../components/ComicGrid/ComicGrid";

const SubscribePage: React.FunctionComponent = () => (
  <Layout title="Sign Up or Modify Subscriptions">
    <Title>Sign Up or Modify Subscriptions</Title>
    <ComicGrid />
  </Layout>
);

export default SubscribePage;
