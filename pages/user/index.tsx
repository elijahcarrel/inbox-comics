import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { Fragment, useState } from "react";
import { DynamicText } from "../../common-components/DynamicText/DynamicText";
import { Layout } from "../../common-components/Layout/Layout";
import { ResendVerificationEmailLink } from "../../components/ResendVerificationEmailLink/ResendVerificationEmailLink";
import { SyndicationEditor } from "../../components/SyndicationEditor/SyndicationEditor";
import { formattedComicDeliveryTime, stringifyGraphQlError, useUrlQuery } from "../../lib/utils";
import styles from "./index.module.scss";
import { H3 } from "../../common-components/H3/H3";

interface User {
  email: string;
  publicId: string;
  verified: boolean;
}

interface UserByPublicIdResponse {
  userByPublicId: User;
}

interface UserByEmailResponse {
  userByEmail: User;
}

const UserPage: React.FunctionComponent = () => {
  const [urlQuery, urlQueryIsReady] = useUrlQuery();
  const publicIdFromUrl = `${urlQuery.publicId || ""}`;
  const emailFromUrl = `${urlQuery.email || ""}`;
  const isNewUser = !!urlQuery.new;
  const [selectedSyndications, setSelectedSyndications] = useState<Set<string> | null>(null);

  // TODO(ecarrel): there's gotta be a better way to do this...
  let userQuery;
  if (publicIdFromUrl.length !== 0) {
    userQuery = gql`
      query userByPublicId {
        userByPublicId(publicId: "${publicIdFromUrl}") {
          email
          publicId
          verified
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
        }
      }
    `;
  }

  const userQueryResponse = useQuery<UserByPublicIdResponse & UserByEmailResponse>(
    userQuery, { skip: !urlQueryIsReady },
  );
  const { data, error, loading } = userQueryResponse;
  if (error) {
    return <Layout error={stringifyGraphQlError(error)} />;
  }

  if (loading || !data || (!data.userByPublicId && !data.userByEmail)) {
    return <Layout title="Loading..." isLoading />;
  }
  const { verified, email, publicId } = data.userByPublicId || data.userByEmail;

  let verificationBlock = null;
  if (verified) {
    if (selectedSyndications == null) {
      // selectedSyndications hasn't loaded yet. Display a generic message.
      verificationBlock = (
        <H3>
          Your email address is <DynamicText>verified</DynamicText>.
        </H3>
      );
    } else if (selectedSyndications.size === 0) {
      verificationBlock = (
        <Fragment>
          <H3>Your email address is <DynamicText>verified</DynamicText>.</H3>
          <H3>
            However, you are not subscribed to any comics, so you will not receive any emails.
            Subscribe to some below in order to receive comics every day.
          </H3>
        </Fragment>
      );
    } else {
      verificationBlock = (
        <Fragment>
          <H3>Your email address is <DynamicText>verified</DynamicText>.</H3>
          <H3>You will get an email at <DynamicText>{formattedComicDeliveryTime()}</DynamicText> every day.</H3>
        </Fragment>
      );
    }
  } else {
    if (isNewUser) {
      verificationBlock = (
        <Fragment>
          <H3>A verification email was just sent to <DynamicText>{email}</DynamicText>.</H3>
          <H3><ResendVerificationEmailLink email={email} /></H3>
          <H3>You'll receive comics once you verify your email.</H3>
        </Fragment>
      );
    } else {
      verificationBlock = (
        <Fragment>
          <H3>Your email address is <DynamicText>not verified</DynamicText>.</H3>
          <H3>Until you verify your email, you will not receive comics.</H3>
          <H3><ResendVerificationEmailLink email={email} /></H3>
        </Fragment>
      );
    }
  }

  return (
    <Layout title="Edit Subscriptions">
      <div className={styles.block}>
        <H3>
          Your email is <DynamicText>{email}</DynamicText>.
        </H3>
        {verificationBlock}
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
