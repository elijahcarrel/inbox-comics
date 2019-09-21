import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useState, Fragment } from "react";
import { DynamicText } from "../../common-components/DynamicText/DynamicText";
import { Layout } from "../../common-components/Layout/Layout";
import { ResendVerificationEmailLink } from "../../components/ResendVerificationEmailLink/ResendVerificationEmailLink";
import { SyndicationEditor } from "../../components/SyndicationEditor/SyndicationEditor";
import { formattedComicDeliveryTime, stringifyGraphQlError, useUrlQuery } from "../../lib/utils";
import styles from "./index.module.scss";

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
        <p>
          Your email address is <DynamicText>verified</DynamicText>.
        </p>
      );
    } else if (selectedSyndications.size === 0) {
      verificationBlock = (
        <Fragment>
          <p>Your email address is <DynamicText>verified</DynamicText>.</p>
          <p>
            However, you are not subscribed to any comics, so you will not receive any emails.
            Subscribe to some below in order to receive comics every day.
          </p>
        </Fragment>
      );
    } else {
      verificationBlock = (
        <Fragment>
          <p>Your email address is <DynamicText>verified</DynamicText>.</p>
          <p>You will get an email at <DynamicText>{formattedComicDeliveryTime()}</DynamicText> every day.</p>
        </Fragment>
      );
    }
  } else {
    if (isNewUser) {
      verificationBlock = (
        <Fragment>
          <p>A verification email was just sent to <DynamicText>{email}</DynamicText>.</p>
          <p><ResendVerificationEmailLink email={email} /></p>
        </Fragment>
      );
    } else {
      verificationBlock = (
        <Fragment>
          <p>Your email address is <DynamicText>not verified</DynamicText>.</p>
          <p>Until you verify your email, you will not receive comics.</p>
          <p><ResendVerificationEmailLink email={email} /></p>
        </Fragment>
      );
    }
  }

  return (
    <Layout title="Edit Subscriptions">
      <div className={styles.block}>
        <p>
          Your email is <DynamicText>{email}</DynamicText>.
        </p>
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
