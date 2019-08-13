import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useEffect, useState } from "react";
// @ts-ignore
import { useToasts } from "react-toast-notifications";
import { Layout } from "../../common-components/Layout/Layout";
import { handleGraphQlResponse, toastType } from "../../lib/utils";

const DoWorkPage: React.FunctionComponent = () => {
  const { addToast } = useToasts();
  const [hasPerformedMutation, setHasPerformedMutation] = useState(false);

  const mutation = gql`
    mutation doWork {
      doWork
    }
  `;
  const [doWorkMutation] = useMutation(mutation);

  useEffect(() => {
    if (!hasPerformedMutation) {
      setHasPerformedMutation(true);
      handleGraphQlResponse(doWorkMutation()).then((result) => {
        const { success, combinedErrorMessage } = result;
        if (success) {
          addToast("Work performed.", toastType.success);
          Router.push({
            pathname: "/",
            query: {},
          });
        } else {
          addToast(combinedErrorMessage, toastType.error);
        }
      });
    }
  }, [hasPerformedMutation, setHasPerformedMutation]);

  return (
    <Layout title="Performing work..." />
  );
};

export default DoWorkPage;
