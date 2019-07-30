import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../common-components/Layout/Layout";
import { ComicGrid } from "../../components/ComicGrid/ComicGrid";

const UserPage = () => {
  const router = useRouter();
  // TODO(ecarrel): handle empty email.
  const { query: { email } } = router;
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
  const [setSubscriptionsMutation, { loading: setSubscriptionsMutationIsLoading }] = useMutation(mutation);
  console.log("setSubscriptionsMutationIsLoading is ", setSubscriptionsMutationIsLoading);

  const userQuery = gql`
    query userByEmail {
      userByEmail(email: "${email}") {
        comics {
          identifier
        }
      }
    }
  `;

  const { data, error, loading } = useQuery(userQuery);
  if (error) {
    throw new Error("Error loading user: " + error.message);
  }
  if (loading) {
    return <div>Loading</div>;
  }
  if (!data || !data.userByEmail) {
    return <div>No user with email {email}.</div>;
  }

  const { comics } = data.userByEmail;
  // @ts-ignore TODO(ecarrel): this is going to come up a lot...
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
          const { data: { comics: updatedComics } } = await setSubscriptionsMutation({ variables: { email, comics: [...newSelectedComics] }});
          if (updatedComics != null) {
            console.log("Updated: ", updatedComics);
          }
        }}
      />
    </Layout>
  );
};

export default UserPage;
