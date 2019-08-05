import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
// @ts-ignore
import { useToasts } from "react-toast-notifications";
import { Layout } from "../../common-components/Layout/Layout";
import { SyndicationGrid } from "../../components/SyndicationGrid/SyndicationGrid";
import { handleGraphQlResponse, stringifyGraphQlError, toastType, useUrlQuery } from "../../lib/utils";

const UserSyndicationsPage = () => {
  const { addToast } = useToasts();
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const email = `${urlQuery.email || ""}`;
  const [selectedSyndications, setSelectedSyndications] = useState(new Set<string>());

  const mutation = gql`
    mutation setSubscriptions($email: String!, $syndications: [String]!) {
      setSubscriptions(email: $email, syndications: $syndications) {
        syndications {
          identifier
        }
      }
    }
  `;
  const [setSubscriptionsMutation] = useMutation(mutation);

  interface UserQueryResponse {
    userByEmail: {
      syndications: Array<{
        identifier: string;
      }>;
    };
  }

  const userQuery = gql`
    query userByEmail {
      userByEmail(email: "${email}") {
        syndications {
          identifier
        }
      }
    }
  `;
  const title = email.length > 0 ? `Comics for ${email}` : "Comics";

  const { data, error, loading } = useQuery<UserQueryResponse>(userQuery, { skip: !urlQueryIsReady });
  useEffect(() => {
    if (!loading && data && data.userByEmail) {
      const { userByEmail: { syndications = [] } } = data;
      setSelectedSyndications(new Set(syndications.map(({identifier}) => identifier)));
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
      <SyndicationGrid
        // @ts-ignore
        selectedSyndications={selectedSyndications}
        onChange={async (newSelectedSyndications) => {
          // Optimistically update UI.
          setSelectedSyndications(newSelectedSyndications);
          const result = await handleGraphQlResponse(setSubscriptionsMutation({
            variables: {
              email,
              syndications: [...newSelectedSyndications],
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

export default UserSyndicationsPage;
