import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Layout } from "../../common-components/Layout/Layout";
import { handleGraphQlResponse, useNonEmptyUrlQuery } from "../../lib/utils";
import { H3 } from "../../common-components/H3/H3";
import { ResendVerificationEmailLink } from "../../components/ResendEmailLink/ResendVerificationEmailLink";

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
  const [verifyEmailMutation, { loading: verificationIsLoading }] = useMutation<
    void
  >(mutation);

  useEffect(() => {
    if (!isVerifying && urlQueryIsReady) {
      setIsVerifying(true);
      handleGraphQlResponse<void>(
        verifyEmailMutation({
          variables: {
            email,
            verificationHash,
          },
        }),
      ).then(({ success, combinedErrorMessage }) => {
        if (success) {
          Router.push({
            pathname: "/user",
            query: { email },
          });
        } else {
          setError(combinedErrorMessage);
        }
      });
    }
  }, [
    email,
    isVerifying,
    setIsVerifying,
    urlQueryIsReady,
    verificationHash,
    verifyEmailMutation,
  ]);

  if (error != null) {
    return (
      <Layout
        error={error}
        errorAction={
          <H3>
            <ResendVerificationEmailLink email={String(email)} />
          </H3>
        }
      />
    );
  }
  if (!urlQueryIsReady) {
    return <Layout title="Verifying..." isLoading />;
  }
  return (
    <Layout title={`Verifying ${email}...`} isLoading={verificationIsLoading} />
  );
};

export default VerifyUserPage;
