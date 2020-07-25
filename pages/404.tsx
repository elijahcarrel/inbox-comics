import { defaultErrorAction } from "../lib/utils";
import { Layout } from "../common-components/Layout/Layout";
import React from "react";

const Error404 = () => {
  return (
    <Layout title="404 Error" error="This page does not exist." errorAction={defaultErrorAction} />
  );
};

export default Error404;
