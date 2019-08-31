import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { Layout } from "../../common-components/Layout/Layout";
import { ResendVerificationEmailLink } from "../../components/ResendVerificationEmailLink/ResendVerificationEmailLink";
import { stringifyGraphQlError, useUrlQuery } from "../../lib/utils";

interface User {
  email: string;
  verified: boolean;
}

interface UserResponse {
  userByEmail: User;
}

const UserPage: React.FunctionComponent = () => {
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const email = `${urlQuery.email || ""}`;
  const title = email.length > 0 ? `User ${email}` : "Loading...";
  const isNewUser = !!urlQuery.new;

  const userQuery = gql`
    query userByEmail {
      userByEmail(email: "${email}") {
        verified
      }
    }
  `;

  const userQueryResponse = useQuery<UserResponse>(userQuery, { skip: !urlQueryIsReady });
  const { data, error, loading } = userQueryResponse;
  if (error) {
    return <Layout title={title} error={stringifyGraphQlError(error)} />;
  }

  if (loading || !data || !data.userByEmail) {
    return <Layout title={title} isLoading />;
  }
  const { verified } = data.userByEmail;

  return (
    <Layout title={title}>
      <ul>
        <li>
          {verified && (
            <span>You are verified.</span>
          )}
          {!verified && !isNewUser && (
            <span>
              You are not verified. Until you verify your email, you will not receive comics.{" "}
              <ResendVerificationEmailLink email={email} />
            </span>
          )}
          {!verified && isNewUser && (
            <span>
              A verification email was just sent to {email}.{" "}
              <ResendVerificationEmailLink email={email} />
            </span>
          )}
        </li>
        <li>
          <CommonLink href={`./user/comics?email=${encodeURIComponent(email)}`}>
            Edit subscriptions.
          </CommonLink>
        </li>
      </ul>
    </Layout>
  );
};

export default UserPage;
