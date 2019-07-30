import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Alert from "react-s-alert";
import { Layout } from "../../common-components/Layout/Layout";
import { ComicGrid } from "../../components/ComicGrid/ComicGrid";

const UserPage = () => {
  const router = useRouter();
  const [skip, setSkip] = useState(false);
  const { query: { email: emailFromQuery } } = router;
  if (!emailFromQuery && !skip) {
    setSkip(true);
  }
  const email = (emailFromQuery || "").toString();
// const [selectedComics, setSelectedComics] = useState(new Set<string>());

  const mutation = gql`
    mutation setSubscriptions($email: String!, $comics: [String]!) {
      setSubscriptions(email: $email, comics: $comics) {
        comics {
          identifier
        }
      }
    }
  `;
  const [setSubscriptionsMutation] = useMutation(mutation);

  interface UserQueryResponse {
    userByEmail: {
      comics: Array<{
        identifier: string;
      }>;
    };
  }

  const userQuery = gql`
    query userByEmail {
      userByEmail(email: "${email}") {
        comics {
          identifier
        }
      }
    }
  `;

  const { data, error, loading } = useQuery<UserQueryResponse>(userQuery, { skip });
  if (error) {
    throw new Error("Error loading user: " + error.message);
  }
  if (loading) {
    return <Layout title={`Comics for ${email}`} isLoading />;
  }
  if (!data || !data.userByEmail) {
    throw new Error(`No user with email ${email}.`);
  }

  const { userByEmail: { comics = [] } } = data;
  const selectedComics = new Set(comics.map(({ identifier }) => identifier));

  return (
    <Layout title={`Comics for ${email}`}>
      <ComicGrid
        // @ts-ignore
        selectedComics={selectedComics}
        onChange={async (newSelectedComics) => {
          // Optimistically update UI.
          // setSelectedComics(newSelectedComics);
          // @ts-ignore
          const {data: {comics: updatedComics}} = await setSubscriptionsMutation({
            variables: {
              email,
              comics: [...newSelectedComics],
            },
          });
          if (updatedComics != null) {
            Alert.success("New settings saved.");
          }
        }}
      />
    </Layout>
  );
};

export default UserPage;
