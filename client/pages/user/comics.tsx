import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import Alert from "react-s-alert";
import { Layout } from "../../common-components/Layout/Layout";
import { ComicGrid } from "../../components/ComicGrid/ComicGrid";
import { useUrlQuery } from "../../lib/utils";

const UserPage = () => {
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const email = `${urlQuery.email}`;

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

  const { data, error, loading } = useQuery<UserQueryResponse>(userQuery, { skip: !urlQueryIsReady });
  if (error) {
    throw new Error("Error loading user: " + error.message);
  }
  if (loading || !data || !data.userByEmail) {
    return <Layout title={`Comics for ${email}`} isLoading />;
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
          const { data: { comics: updatedComics } } = await setSubscriptionsMutation({
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
