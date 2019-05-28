import * as React from "react";
import { Layout } from "../common-components/Layout/Layout";
import { Title } from "../common-components/Title/Title";
import { ComicsList } from "../components/Comics";

const SubscribePage: React.FunctionComponent = () => (
  <Layout title="Subscribe">
    <Title>Subscribe</Title>
    <p>
      Haven't built this page yet but the connection to the (new) database is up and running, check it out:
    </p>
    <p>
      Comics available are:
      <ComicsList />
    </p>
  </Layout>
);

export default SubscribePage;
