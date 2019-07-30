import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { Layout } from "../../common-components/Layout/Layout";
import { LoadingOverlay } from "../../common-components/LoadingOverlay/LoadingOverlay";

interface User {
  email: string;
  verified: boolean;
}

interface UserResponse {
  userByEmail: User;
}

const UserPage: React.FunctionComponent = () => {
  const router = useRouter();
  const [skip, setSkip] = useState(false);
  const { query: { email: emailFromQuery } } = router;

  if (!emailFromQuery && !skip) {
    setSkip(true);
  }
  const email = (emailFromQuery || "").toString();

  const userQuery = gql`
    query userByEmail {
      userByEmail(email: "${email}") {
        verified
      }
    }
  `;

  const userQueryResponse = useQuery<UserResponse>(userQuery, { skip });
  const { data, error, loading } = userQueryResponse;
  if (error) {
    throw new Error("Error loading user: " + error.message);
  }
  if (loading) {
    return <Layout title={`User ${email}`} isLoading />;
  }
  if (!data || !data.userByEmail) {
    throw new Error(`No user with email ${email}.`);
  }
  const { verified } = data.userByEmail;

  return (
    <Layout title={`User ${email}`}>
      {loading && (<LoadingOverlay />)}
      {!loading && (
        <ul>
          <li>
            {verified && (
              <span>You are verified.</span>
            )}
            {!verified && (
              <span>You are not verified.</span>
            )}
          </li>
          <li>
            <CommonLink href={`./user/comics?email=${encodeURI(email)}`}>
              Edit subscriptions.
            </CommonLink>
          </li>
        </ul>
      )}
    </Layout>
  );
};

export default UserPage;
