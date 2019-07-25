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

interface ComicsResponse {
  users: User[];
}

const UserPage: React.FunctionComponent = () => {
  const router = useRouter();
  const { query: { email } } = router;

  const userQuery = gql`
    query users {
      getUser(email: "${email}") {
        email
        verified
      }
    }
  `;

  return (
    <Layout title={`User ${email}`}>
      <Query<ComicsResponse> query={userQuery}>
        {({ loading, error, data }) => {
          if (error) {
            throw new Error("Error loading comics: " + error.message);
          }
          if (loading) {
            return <div>Loading</div>;
          }
          if (!data || !data.users || data.users.length === 0) {
            return <div>No users with email {email}.</div>;
          } else if (data.users.length > 1) {
            return <div>Multiple users with email {email}.</div>;
          }
          const { verified } = data.users[0];
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
                <CommonLink href="./comics">
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
