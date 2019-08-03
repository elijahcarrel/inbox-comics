import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import Alert from "react-s-alert";
import { Layout } from "../../common-components/Layout/Layout";
import { handleGraphQlResponse, useUrlQuery } from "../../lib/utils";

const EditUserPage: React.FunctionComponent = () => {
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const email = `${urlQuery.email}`;
  const verificationHash = `${urlQuery.verificationHash}`;

  const [isVerifying, setIsVerifying] = useState(false);

  const mutation = gql`
    mutation verifyEmail($email: String!, $verificationHash: String!) {
      verifyEmail(email: $email, verificationHash: $verificationHash)
    }
  `;
  interface VerifyEmailResponse {}
  const [
    verifyEmailMutation,
    { loading: verificationIsLoading },
  ] = useMutation<VerifyEmailResponse>(mutation, { variables: { email, verificationHash } });

  useEffect(() => {
    if (!isVerifying && urlQueryIsReady) {
      setIsVerifying(true);
      handleGraphQlResponse(verifyEmailMutation()).then((result: any) => {
        if (result.success) {
          Router.push({
            pathname: "/user",
            query: { email },
          });
        } else {
          Alert.error(`An error occurred during verification: ${result.error}`);
        }
      });
    }
  }, [isVerifying, setIsVerifying, urlQueryIsReady]);

  return (
    <Layout title={`Verifying ${email}...`} isLoading={verificationIsLoading}>
    </Layout>
  );
};

export default EditUserPage;
