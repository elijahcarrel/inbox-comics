import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { LoadingOverlay } from "../../common-components/LoadingOverlay/LoadingOverlay";
import {
  handleGraphQlResponse,
  stringifyGraphQlError,
  toastType,
} from "../../lib/utils";
import { SyndicationGrid } from "../SyndicationGrid/SyndicationGrid";

interface Props {
  publicId: string;
  isNewUser: boolean;
  // TODO(ecarrel): kinda gross that these two things are handled internally
  //  and externally.
  onChangeSelectedSyndications?: (selectedSyndications: string[]) => void;
  onReceiveEmail?: (email: string) => any;
}

// TODO(ecarrel): hooks logic and management of selectedSyndications is awful
//  in this whole file.
export const SyndicationEditor = (props: Props) => {
  const { addToast, removeToast } = useToasts();
  const { publicId, isNewUser, onChangeSelectedSyndications, onReceiveEmail } =
    props;
  const [selectedSyndications, setSelectedSyndications] = useState(
    [] as string[],
  );
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
      syndications: {
        identifier: string;
      }[];
    };
  }

  const updateSyndications = async (newSelectedSyndications: string[]) => {
    // Optimistically update UI.
    setSelectedSyndications(newSelectedSyndications);
    if (onChangeSelectedSyndications) {
      onChangeSelectedSyndications(newSelectedSyndications);
    }
    return handleGraphQlResponse<void>(
      putUserMutation({
        variables: {
          publicId,
          user: {
            email,
            publicId,
            syndications: newSelectedSyndications,
          },
        },
      }),
    );
  };

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

  const userQueryResponse = useQuery<UserQueryResponse>(userQuery);

  const syndicationsQuery = gql`
    query syndications {
      syndications {
        title
        identifier
        numSubscribers
      }
    }
  `;

  // TODO(ecarrel): consolidate into common API types file (perhaps shared client/server?)
  interface Syndication {
    title: string;
    identifier: string;
    numSubscribers: number;
  }

  interface SyndicationsResponse {
    syndications: Syndication[];
  }

  const syndicationsQueryResponse =
    useQuery<SyndicationsResponse>(syndicationsQuery);

  useEffect(() => {
    if (
      !userQueryResponse.loading &&
      userQueryResponse.data &&
      userQueryResponse.data.userByPublicId
    ) {
      const {
        userByPublicId: { syndications, email: emailFromQuery },
      } = userQueryResponse.data;
      if (syndications != null) {
        const newSelectedSyndications = syndications.map(
          ({ identifier }) => identifier,
        );
        setSelectedSyndications(newSelectedSyndications);
        if (onChangeSelectedSyndications) {
          onChangeSelectedSyndications(newSelectedSyndications);
        }
      }
      setEmail(emailFromQuery);
      if (onReceiveEmail) {
        onReceiveEmail(emailFromQuery);
      }
    }
  }, [
    onChangeSelectedSyndications,
    onReceiveEmail,
    userQueryResponse.data,
    userQueryResponse.loading,
  ]);
  if (syndicationsQueryResponse.error) {
    // TODO(ecarrel): handle errors better.
    throw new Error(stringifyGraphQlError(syndicationsQueryResponse.error));
  }
  if (userQueryResponse.error) {
    throw new Error(stringifyGraphQlError(userQueryResponse.error));
  }
  if (
    syndicationsQueryResponse.loading ||
    !syndicationsQueryResponse.data ||
    !syndicationsQueryResponse.data.syndications ||
    userQueryResponse.loading ||
    !userQueryResponse.data ||
    !userQueryResponse.data.userByPublicId
  ) {
    return <LoadingOverlay />;
  }

  return (
    <SyndicationGrid
      syndications={syndicationsQueryResponse.data.syndications}
      selectedSyndicationIdentifiers={selectedSyndications}
      onChange={async (newSelectedSyndications) => {
        const oldSelectedSyndications = [...selectedSyndications];
        const result = await updateSyndications(newSelectedSyndications);
        if (result.success) {
          if (!isNewUser) {
            let toastId: null | string;
            const setToastId = (id: string) => {
              toastId = id;
            };
            addToast(
              <>
                Subscriptions updated.{" "}
                <CommonLink
                  onClick={async () => {
                    const undoResult = await updateSyndications(
                      oldSelectedSyndications,
                    );
                    if (undoResult.success) {
                      if (toastId != null) {
                        removeToast(toastId);
                      }
                    } else {
                      addToast(
                        `Could not undo update to subscriptions: ${result.combinedErrorMessage}`,
                        toastType.error,
                      );
                    }
                  }}
                >
                  Undo.
                </CommonLink>
              </>,
              toastType.success,
              setToastId,
            );
          }
        } else {
          addToast(
            `Could not update subscriptions: ${result.combinedErrorMessage}`,
            toastType.error,
          );
        }
      }}
    />
  );
};
