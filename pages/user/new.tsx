import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { CallToAction } from "../../common-components/CallToAction/CallToAction";
import { DynamicText } from "../../common-components/DynamicText/DynamicText";
import { H3 } from "../../common-components/H3/H3";
import { Layout } from "../../common-components/Layout/Layout";
import { SyndicationEditor } from "../../components/SyndicationEditor/SyndicationEditor";
import { handleGraphQlResponse, toastType, useUrlQuery } from "../../lib/utils";

const UserSyndicationsPage = () => {
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const publicId = `${urlQuery.publicId || ""}`;
  const [selectedSyndications, setSelectedSyndications] = useState<
    string[] | null
  >(null);
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
  const [createUserWithoutEmailMutation] =
    useMutation<CreateUserResponse>(mutation);

  let title = "Loading...";
  let helperText = (
    <H3>Choose comics to receive in your email every morning.</H3>
  );
  if (urlQueryIsReady) {
    title = "Choose Comics";
    if (selectedSyndications && selectedSyndications.length > 0) {
      helperText = (
        <H3>
          {selectedSyndications.length > 1 ? "These " : "This "}
          <DynamicText>{selectedSyndications.length}</DynamicText>
          {selectedSyndications.length > 1 ? " comics " : " comic "}
          will be emailed to you every morning in a single email.
        </H3>
      );
    }
  }

  useEffect(() => {
    if (urlQueryIsReady && publicId.length === 0) {
      // No public id supplied. Create a new user.
      handleGraphQlResponse<CreateUserResponse>(
        createUserWithoutEmailMutation(),
      ).then(async ({ success, combinedErrorMessage, result }) => {
        if (success) {
          const url = {
            pathname: "/user/new",
            query: {
              publicId: result?.data?.createUserWithoutEmail.publicId,
            },
          };
          await Router.push(url, url, { shallow: true });
        } else {
          toast.error(combinedErrorMessage);
        }
      });
    }
  }, [urlQueryIsReady, publicId, createUserWithoutEmailMutation]);

  if (publicId.length === 0) {
    return <Layout title={title} isLoading />;
  }

  return (
    <Layout title={title}>
      {helperText}
      <SyndicationEditor
        publicId={publicId}
        onChangeSelectedSyndications={setSelectedSyndications}
        isNewUser
      />
      {selectedSyndications && (
        <CallToAction
          isSticky={selectedSyndications.length > 0}
          onClick={async () => {
            await Router.push({
              pathname: "/user/subscribe",
              query: { publicId },
            });
          }}
        >
          {selectedSyndications.length > 0
            ? "Next →"
            : "Continue Without Selecting Comics →"}
        </CallToAction>
      )}
    </Layout>
  );
};

export default UserSyndicationsPage;
