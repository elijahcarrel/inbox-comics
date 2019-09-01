import { useMutation } from "@apollo/react-hooks";
import classNames from "classnames";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useEffect, useState } from "react";
// @ts-ignore
import { useToasts } from "react-toast-notifications";
import { Button } from "../../common-components/Button/Button";
import { Layout } from "../../common-components/Layout/Layout";
import { SyndicationEditor } from "../../components/SyndicationEditor/SyndicationEditor";
import { handleGraphQlResponse, toastType, useUrlQuery } from "../../lib/utils";
import styles from "./comics.module.scss";

const UserSyndicationsPage = () => {
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const publicId = `${urlQuery.publicId || ""}`;
  const isNewUser = !!urlQuery.new;
  const [selectedSyndications, setSelectedSyndications] = useState<Set<string> | null>(null);
  const [email, setEmail] = useState("");
  const { addToast } = useToasts();
  const mutation = gql`
    mutation createUserWithoutEmail {
      createUserWithoutEmail {
        publicId
      }
    }
  `;
  interface CreateUserResponse {
    createUserWithoutEmail: {
      publicId: string;
    };
  }
  const [createUserWithoutEmailMutation] = useMutation<CreateUserResponse>(mutation);

  let title = "Loading...";
  if (urlQueryIsReady) {
    title = "Comics";
    if (isNewUser) {
      title = "Choose Comics";
    } else if (email && email.length > 0) {
      title = `Update Comics for ${email}`;
    }
  }

  useEffect(() => {
    if (urlQueryIsReady && publicId.length === 0) {
      // No public id supplied. Create a new user.
      handleGraphQlResponse(createUserWithoutEmailMutation()).then(async (result) => {
        const { success, combinedErrorMessage } = result;
        if (success) {
          const url = {
            pathname: "/user/comics",
            query: {
              publicId: result.result.data.createUserWithoutEmail.publicId,
              new: true,
            },
          };
          await Router.push(url, url, { shallow: true });
        } else {
          addToast(combinedErrorMessage, toastType.error);
        }
      });
    }
  }, [urlQueryIsReady, publicId, addToast]);

  if (publicId.length === 0) {
    return <Layout title={title} isLoading />;
  }

  return (
    <Layout title={title}>
      <SyndicationEditor
        publicId={publicId}
        isNewUser={isNewUser}
        onChangeSelectedSyndications={setSelectedSyndications}
        onReceiveEmail={setEmail}
      />
      {isNewUser && selectedSyndications && (
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
