import React from "react";
import { defaultErrorAction } from "../lib/utils";
import { Layout } from "../common-components/Layout/Layout";

const Error404 = () => {
  return (
    <Layout
      title="404 Error"
      error="This page does not exist."
      errorAction={defaultErrorAction}
    />
  );
};

export default Error404;
