// @ts-ignore TODO(ecarrel): figure out why typescript doesn't know about this.
import gql from "graphql-tag";
// @ts-ignore
import { useRouter } from "next/router";
import * as React from "react";
import { Query } from "react-apollo";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { Layout } from "../../common-components/Layout/Layout";

interface User {
  email: string;
  verified: boolean;
}

interface UserResponse {
  userByEmail: User;
}

const UserPage: React.FunctionComponent = () => {
  const router = useRouter();
  const { query: { email: emailFromQuery } } = router;

  if (!emailFromQuery) {
    return <div>No email provided.</div>;
  }
  const email = emailFromQuery.toString();

  const userQuery = gql`
    query userByEmail {
      userByEmail(email: "${email}") {
        email
        verified
      }
    }
  `;

  return (
    <Layout title={`User ${email}`}>
      <Query<UserResponse> query={userQuery}>
        {({ loading, error, data }) => {
          if (error) {
            throw new Error("Error loading comics: " + error.message);
          }
          if (loading) {
            return <div>Loading</div>;
          }
          if (!data || !data.userByEmail) {
            return <div>No user with email {email}.</div>;
          }
          const { verified } = data.userByEmail;
          return (
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
          );
        }}
      </Query>
    </Layout>
  );
};

export default UserPage;
