import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Layout } from "../../common-components/Layout/Layout";
import { SyndicationEditor } from "../../components/SyndicationEditor/SyndicationEditor";
import { stringifyGraphQlError, useUrlQuery } from "../../lib/utils";
import styles from "./index.module.scss";
import {
  Email,
  UserInfoBlock,
} from "../../components/UserInfoBlock/UserInfoBlock";

interface User {
  email: string;
  publicId: string;
  verified: boolean;
  enabled: boolean;
  emails?: Email[];
}

interface UserByPublicIdResponse {
  userByPublicId: User;
}

export interface UserByEmailResponse {
  userByEmail: User;
}

const UserPage: React.FunctionComponent = () => {
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const publicIdFromUrl = `${urlQuery.publicId || ""}`;
  const emailFromUrl = `${urlQuery.email || ""}`;
  const isNewUser = !!urlQuery.new;
  const hasJustChangedEmail = !!urlQuery.oldEmail;
  const [
    selectedSyndications,
    setSelectedSyndications,
  ] = useState<Set<string> | null>(null);

  // TODO(ecarrel): there's gotta be a better way to do this...
  let userQuery;
  if (publicIdFromUrl.length !== 0) {
    userQuery = gql`
      query userByPublicId {
        userByPublicId(publicId: "${publicIdFromUrl}") {
          email
          publicId
          verified
          enabled
          emails {
            messageId
          }
        }
      }
    `;
  } else {
    userQuery = gql`
      query userByEmail {
        userByEmail(email: "${emailFromUrl}") {
          email
          publicId
          verified
          enabled
          emails {
            messageId
          }
        }
      }
    `;
  }

  const userQueryResponse = useQuery<
    UserByPublicIdResponse & UserByEmailResponse
  >(userQuery, { skip: !urlQueryIsReady });
  const { data, error, loading } = userQueryResponse;
  if (error) {
    return <Layout error={stringifyGraphQlError(error)} />;
  }

  if (loading || !data || (!data.userByPublicId && !data.userByEmail)) {
    return <Layout title="Loading..." isLoading />;
  }
  const { verified, enabled, email, publicId, emails = [] } =
    data.userByPublicId || data.userByEmail;

  return (
    <Layout title="My Account">
      <div className={styles.block}>
        <UserInfoBlock
          verified={verified}
          enabled={enabled}
          email={email}
          publicId={publicId}
          emails={emails}
          selectedSyndications={selectedSyndications}
          isNewUser={isNewUser}
          hasJustChangedEmail={hasJustChangedEmail}
        />
      </div>
      <SyndicationEditor
        publicId={publicId}
        isNewUser={false}
        onChangeSelectedSyndications={setSelectedSyndications}
      />
    </Layout>
  );
};

export default UserPage;
