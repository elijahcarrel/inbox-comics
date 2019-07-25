import { useRouter } from "next/router";
import * as React from "react";
import { Layout } from "../common-components/Layout/Layout";
import { ComicGrid } from "../components/ComicGrid/ComicGrid";

const UserPage: React.FunctionComponent = () => {
  const router = useRouter();
  const { query: { email } } = router;
  return (
    <Layout title={`Comics for ${email}`}>

      <ComicGrid initialSelectedComics={{}}/>
    </Layout>
  );
};

export default UserPage;
