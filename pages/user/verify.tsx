import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Layout } from "../../common-components/Layout/Layout";
import { GraphQlResult, handleGraphQlResponse, useNonEmptyUrlQuery } from "../../lib/utils";
import { H3 } from "../../common-components/H3/H3";
import { ResendVerificationEmailLink } from "../../components/ResendVerificationEmailLink/ResendVerificationEmailLink";

const VerifyUserPage: React.FunctionComponent = () => {
  const [urlQuery, urlQueryIsReady] = useNonEmptyUrlQuery();
  const email = `${urlQuery.email}`;
  const verificationHash = `${urlQuery.verificationHash}`;

  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const mutation = gql`
    mutation verifyEmail($email: String!, $verificationHash: String!) {
      verifyEmail(email: $email, verificationHash: $verificationHash)
    }
  `;
  interface VerifyEmailResponse {}
  const [
    verifyEmailMutation,
    { loading: verificationIsLoading },
  ] = useMutation<VerifyEmailResponse>(mutation);

  useEffect(() => {
    if (!isVerifying && urlQueryIsReady) {
      setIsVerifying(true);
      handleGraphQlResponse(verifyEmailMutation({
        variables: {
          email,
          verificationHash,
        },
      })).then((result: GraphQlResult) => {
        if (result.success) {
          Router.push({
            pathname: "/user",
            query: { email },
          });
        } else {
          setError(result.combinedErrorMessage);
        }
      });
    }
  }, [isVerifying, setIsVerifying, urlQueryIsReady]);

  if (error != null) {
    return <Layout error={error} errorAction={(
      <H3><ResendVerificationEmailLink email={String(email)} /></H3>
    )} />;
  }
  if (!urlQueryIsReady) {
    return <Layout title="Verifying..." isLoading />;
  }
  return (
    <Layout title={`Verifying ${email}...`} isLoading={verificationIsLoading}>
    </Layout>
  );
};

export default VerifyUserPage;
