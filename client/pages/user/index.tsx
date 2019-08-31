import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { Layout } from "../../common-components/Layout/Layout";
import { ResendVerificationEmailLink } from "../../components/ResendVerificationEmailLink/ResendVerificationEmailLink";
import { stringifyGraphQlError, useUrlQuery } from "../../lib/utils";

interface User {
  email: string;
  publicId: string;
  verified: boolean;
}

interface UserByPublicIdResponse {
  userByPublicId: User;
}

interface UserByEmailResponse {
  userByEmail: User;
}

const UserPage: React.FunctionComponent = () => {
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const publicIdFromUrl = `${urlQuery.publicId || ""}`;
  const emailFromUrl = `${urlQuery.email || ""}`;
  const isNewUser = !!urlQuery.new;

  let userQuery;
  if (publicIdFromUrl.length !== 0) {
    userQuery = gql`
      query userByPublicId {
        userByPublicId(publicId: "${publicIdFromUrl}") {
          email
          publicId
          verified
        }
      }
    `;
  } else {
    userQuery = gql`
      query userByEmail {
        userByEmail(email: "${emailFromUrl}") {
          email
          publicId
          verified
        }
      }
    `;
  }

  const userQueryResponse = useQuery<UserByPublicIdResponse & UserByEmailResponse>(
    userQuery, { skip: !urlQueryIsReady },
  );
  const { data, error, loading } = userQueryResponse;
  if (error) {
    return <Layout error={stringifyGraphQlError(error)} />;
  }

  if (loading || !data || (!data.userByPublicId && !data.userByEmail)) {
    return <Layout title="Loading..." isLoading />;
  }
  const { verified, email, publicId } = data.userByPublicId || data.userByEmail;

  return (
    <Layout title={`User ${email}`}>
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
          <CommonLink href={`/user/comics?publicId=${publicId}`}>
            Edit subscriptions.
          </CommonLink>
        </li>
      </ul>
    </Layout>
  );
};

export default UserPage;
