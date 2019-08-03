import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Layout } from "../../common-components/Layout/Layout";
import { handleGraphQlResponse, useUrlQuery } from "../../lib/utils";

const EditUserPage: React.FunctionComponent = () => {
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
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
          setError(result.combinedErrorMessage);
        }
      });
    }
  }, [isVerifying, setIsVerifying, urlQueryIsReady]);

  if (error != null) {
    return <Layout error={error} />;
  }
  return (
    <Layout title={`Verifying ${email}...`} isLoading={verificationIsLoading}>
    </Layout>
  );
};

export default EditUserPage;
