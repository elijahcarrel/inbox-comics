import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Layout } from "../../common-components/Layout/Layout";
import {
  handleGraphQlResponse,
  stringifyGraphQlError,
  useUrlQuery,
} from "../../lib/utils";
import { H3 } from "../../common-components/H3/H3";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";

const UnsubscribeUserPage = () => {
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const email = `${urlQuery.email || ""}`;
  const mutation = gql`
    mutation unsubscribeUser($email: String!) {
      unsubscribeUser(email: $email) {
        email
      }
    }
  `;
  interface UnsubscribeUserResponse {
    unsubscribeUser: {
      email: string;
    };
  }
  const [unsubscribeUserMutation, { error, loading }] =
    useMutation<UnsubscribeUserResponse>(mutation, { variables: { email } });

  const title = "Unsubscribing...";

  useEffect(() => {
    if (urlQueryIsReady && email.length > 0) {
      handleGraphQlResponse<UnsubscribeUserResponse>(
        unsubscribeUserMutation(),
      ).then(async ({ success, result }) => {
        if (success) {
          toast.success("Account is now disabled.");
          const url = {
            pathname: "/user",
            query: {
              email: result?.data?.unsubscribeUser.email,
            },
          };
          await Router.push(url, url, { shallow: true });
        }
      });
    }
  }, [urlQueryIsReady, email, unsubscribeUserMutation]);

  const errorAction = (
    <H3>
      Try heading over to your{" "}
      <CommonLink href="/user/edit">account page</CommonLink> to unsubscribe.
    </H3>
  );

  if (error) {
    return (
      <Layout error={stringifyGraphQlError(error)} errorAction={errorAction} />
    );
  }

  if (urlQueryIsReady && !loading && email?.length === 0) {
    return (
      <Layout
        error={"No email was found in the URL."}
        errorAction={errorAction}
      />
    );
  }

  return <Layout title={title} isLoading />;
};

export default UnsubscribeUserPage;
