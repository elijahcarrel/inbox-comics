import { useMutation, useQuery } from "@apollo/react-hooks";
import classNames from "classnames";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useEffect, useState } from "react";
// @ts-ignore
import { useToasts } from "react-toast-notifications";
import { Button } from "../../common-components/Button/Button";
import { Layout } from "../../common-components/Layout/Layout";
import { SyndicationGrid } from "../../components/SyndicationGrid/SyndicationGrid";
import { handleGraphQlResponse, stringifyGraphQlError, toastType, useUrlQuery } from "../../lib/utils";
import styles from "./comics.module.scss";

const UserSyndicationsPage = () => {
  const { addToast } = useToasts();
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const publicId = `${urlQuery.publicId || ""}`;
  const isNewUser = !!urlQuery.new;
  const [selectedSyndications, setSelectedSyndications] = useState(new Set<string>());
  const [email, setEmail] = useState<string | null>(null);

  const mutation = gql`
    mutation putUser($publicId: String!, $user: InputUser!) {
      putUser(publicId: $publicId, user: $user) {
        syndications {
          identifier
        }
      }
    }
  `;
  const [putUserMutation] = useMutation(mutation);

  interface UserQueryResponse {
    userByPublicId: {
      email: string;
      syndications: Array<{
        identifier: string;
      }>;
    };
  }

  const userQuery = gql`
    query userByPublicId {
      userByPublicId(publicId: "${publicId}") {
        email
        syndications {
          identifier
        }
      }
    }
  `;
  let title = "Loading...";
  if (urlQueryIsReady) {
    title = "Comics";
    if (isNewUser) {
      title = "Choose Comics";
    } else if (email && email.length > 0) {
      title = `Update Comics for ${email}`;
    }
  }
  const userQueryResponse = useQuery<UserQueryResponse>(userQuery, { skip: !urlQueryIsReady });

  const syndicationsQuery = gql`
    query syndications {
      syndications {
        title
        identifier
      }
    }
  `;

  // TODO(ecarrel): consolidate into common API types file (perhaps shared client/server?)
  interface Syndication {
    title: string;
    identifier: string;
  }

  interface SyndicationsResponse {
    syndications: Syndication[];
  }

  const syndicationsQueryResponse = useQuery<SyndicationsResponse>(syndicationsQuery);

  useEffect(() => {
    if (!userQueryResponse.loading && userQueryResponse.data && userQueryResponse.data.userByPublicId) {
      const { userByPublicId: { syndications = [], email: emailFromQuery } } = userQueryResponse.data;
      setSelectedSyndications(new Set(syndications.map(({ identifier }) => identifier)));
      setEmail(emailFromQuery);
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
    !userQueryResponse.data.userByPublicId
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
          const result = await handleGraphQlResponse(putUserMutation({
            variables: {
              publicId,
              user: {
                email,
                publicId,
                syndications: [...newSelectedSyndications],
              },
            },
          }));
          if (result.success) {
            if (!isNewUser) {
              addToast("Subscriptions updated.", toastType.success);
            }
          } else {
            addToast(`Could not update subscriptions: ${result.combinedErrorMessage}`, toastType.error);
          }
        }}
      />
      {isNewUser && (
        <div className={classNames(styles.outerButtonContainer, {
          [styles.isSticky]: selectedSyndications.size > 0,
        })}>
          <div className={styles.faderElement} />
          <div className={styles.innerButtonContainer}>
            <Button
              onClick={async () => {
                await Router.push({
                  pathname: "/user/subscribe",
                  query: { publicId },
                });
              }}
              className={styles.button}
            >
              {selectedSyndications.size > 0 ? "Next →" : "Continue without selecting comics →"}
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserSyndicationsPage;
