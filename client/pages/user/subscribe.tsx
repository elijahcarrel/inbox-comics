import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useEffect, useState } from "react";
// @ts-ignore
import { useToasts } from "react-toast-notifications";
import { Button } from "../../common-components/Button/Button";
import { Layout } from "../../common-components/Layout/Layout";
import { TextInput } from "../../common-components/TextInput/TextInput";
import { handleGraphQlResponse, stringifyGraphQlError, toastType, useUrlQuery } from "../../lib/utils";
import styles from "./subscribe.module.scss";

// TODO(ecarrel): share type with server API models.
interface User {
  publicId: string;
  email: string;
  syndications: string[];
}

const NewUserPage: React.FunctionComponent = () => {
  const { addToast } = useToasts();
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const publicId = `${urlQuery.publicId || ""}`;
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const mutation = gql`
    mutation putUser($publicId: String!, $user: InputUser!) {
      putUser(publicId: $publicId, user: $user) {
        syndications {
          identifier
        }
      }
    }
  `;
  const [putUserMutation, { loading }] = useMutation(mutation);

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
              publicId
              syndications {
                  identifier
              }
          }
      }
  `;
  const userQueryResponse = useQuery<UserQueryResponse>(userQuery, { skip: !urlQueryIsReady });

  useEffect(() => {
    if (!userQueryResponse.loading && userQueryResponse.data && userQueryResponse.data.userByPublicId) {
      const { userByPublicId: { email, syndications } } = userQueryResponse.data;
      setUser({
        email,
        publicId,
        syndications: syndications.map(({ identifier }) => identifier),
      });
    }
  }, [userQueryResponse.data, userQueryResponse.loading]);
  if (userQueryResponse.error) {
    return <Layout error={stringifyGraphQlError(userQueryResponse.error)} />;
  }
  const title = "Finish Subscribing";
  if (
    userQueryResponse.loading ||
    !userQueryResponse.data ||
    !userQueryResponse.data.userByPublicId ||
    user == null ||
    isLoadingNextPage
  ) {
    return <Layout title={title} isLoading />;
  }

  return (
    <Layout title={title} isLoading={loading} >
      <div className={styles.container}>
        <TextInput
          name="email"
          value={user.email}
          onChange={(email: string) => setUser({
            ...user,
            email,
          })}
          type="email"
          placeholder="Email"
        />
        <br />
        <Button
          onClick={async () => {
            setIsLoadingNextPage(true);
            const result = await handleGraphQlResponse(putUserMutation(
              {
                variables: {
                  user,
                  publicId,
                },
              }));
            const { success, combinedErrorMessage } = result;
            if (success) {
              await Router.push({
                pathname: "/user",
                query: {
                  publicId: user.publicId,
                  new: true,
                },
              });
            } else {
              addToast(combinedErrorMessage, toastType.error);
            }
            setIsLoadingNextPage(false);
          }}
          className={styles.button}
          disabled={loading}
        >
          Go
        </Button>
      </div>
    </Layout>
  );
};

export default NewUserPage;
