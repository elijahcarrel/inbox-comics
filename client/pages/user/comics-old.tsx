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
  const userQueryResponse = useQuery<UserQueryResponse>(userQuery, { skip: !urlQueryIsReady });

  const syndicationsQuery = gql`
      query syndications {
          syndications {
              title
              identifier
          }
      }
  `;

  // TODO(ecarrel): consolidate into common types file (perhaps shared client/server?)
  interface Syndication {
    title: string;
    identifier: string;
  }

  interface SyndicationsResponse {
    syndications: Syndication[];
  }

  const syndicationsQueryResponse = useQuery<SyndicationsResponse>(syndicationsQuery);

  useEffect(() => {
    if (!userQueryResponse.loading && userQueryResponse.data && userQueryResponse.data.userByEmail) {
      const { userByEmail: { syndications = [] } } = userQueryResponse.data;
      setSelectedSyndications(new Set(syndications.map(({ identifier }) => identifier)));
    }
  }, [userQueryResponse.data, userQueryResponse.loading]);
  if (syndicationsQueryResponse.error) {
    return <Layout error={stringifyGraphQlError(syndicationsQueryResponse.error)} />;
  }
  if (userQueryResponse.error) {
    return <Layout error={stringifyGraphQlError(userQueryResponse.error)} />;
  }
  if (
    syndicationsQueryResponse.loading ||
    !syndicationsQueryResponse.data ||
    !syndicationsQueryResponse.data.syndications ||
    userQueryResponse.loading ||
    !userQueryResponse.data ||
    !userQueryResponse.data.userByEmail
  ) {
    return <Layout title={title} isLoading />;
  }

  return (
    <Layout title={title}>
      <SyndicationGrid
        syndications={syndicationsQueryResponse.data.syndications}
        selectedSyndicationIdentifiers={selectedSyndications}
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
