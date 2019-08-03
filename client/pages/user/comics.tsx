import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
// @ts-ignore
import { useToasts } from "react-toast-notifications";
import { Layout } from "../../common-components/Layout/Layout";
import { ComicGrid } from "../../components/ComicGrid/ComicGrid";
import { handleGraphQlResponse, stringifyGraphQlError, toastType, useUrlQuery } from "../../lib/utils";

const UserPage = () => {
  const { addToast } = useToasts();
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const email = `${urlQuery.email || ""}`;
  const [selectedComics, setSelectedComics] = useState(new Set<string>());

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
  const title = email.length > 0 ? `Comics for ${email}` : "Comics";

  const { data, error, loading } = useQuery<UserQueryResponse>(userQuery, { skip: !urlQueryIsReady });
  useEffect(() => {
    if (!loading && data && data.userByEmail) {
      const {userByEmail: {comics = []}} = data;
      setSelectedComics(new Set(comics.map(({identifier}) => identifier)));
    }
  }, [data, loading]);
  if (error) {
    return <Layout error={stringifyGraphQlError(error)} />;
  }
  if (loading || !data || !data.userByEmail) {
    return <Layout title={title} isLoading />;
  }

  return (
    <Layout title={title}>
      <ComicGrid
        // @ts-ignore
        selectedComics={selectedComics}
        onChange={async (newSelectedComics) => {
          // Optimistically update UI.
          setSelectedComics(newSelectedComics);
          const result = await handleGraphQlResponse(setSubscriptionsMutation({
            variables: {
              email,
              comics: [...newSelectedComics],
            },
          }));
          if (result.success) {
            addToast("Subscriptions updated.", toastType.success);
          } else {
            addToast(`Could not update subscriptions: ${result.combinedErrorMessage}`, toastType.error);
          }
        }}
      />
    </Layout>
  );
};

export default UserPage;
