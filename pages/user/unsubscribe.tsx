import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Layout } from "../../common-components/Layout/Layout";
import { handleGraphQlResponse, useUrlQuery } from "../../lib/utils";

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
  const [unsubscribeUserMutation] = useMutation<UnsubscribeUserResponse>(
    mutation,
    { variables: { email } },
  );

  const title = "Unsubscribing...";

  useEffect(() => {
    if (urlQueryIsReady && email.length > 0) {
      handleGraphQlResponse<UnsubscribeUserResponse>(
        unsubscribeUserMutation(),
      ).then(async ({ success, combinedErrorMessage, result }) => {
        if (success) {
          toast.success("Account is now disabled.");
          const url = {
            pathname: "/user",
            query: {
              email: result?.data?.unsubscribeUser.email,
            },
          };
          await Router.push(url, url, { shallow: true });
        } else {
          toast.error(combinedErrorMessage);
        }
      });
    }
  }, [urlQueryIsReady, email, unsubscribeUserMutation]);

  return <Layout title={title} isLoading />;

  //     return (
  //         <Layout title={title}>
  //             Unable to unsubscribe. Please go to your{" "}
  //             <CommonLink href="/user/edit">account page</CommonLink>{" "}
  //             and unsubscribe from there.
  //         </Layout>
  //     );
};

export default UnsubscribeUserPage;
