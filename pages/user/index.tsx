import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { Fragment, useState } from "react";
import { DynamicText } from "../../common-components/DynamicText/DynamicText";
import { Layout } from "../../common-components/Layout/Layout";
import { ResendVerificationEmailLink } from "../../components/ResendEmailLink/ResendVerificationEmailLink";
import { SyndicationEditor } from "../../components/SyndicationEditor/SyndicationEditor";
import { formattedComicDeliveryTime, stringifyGraphQlError, useUrlQuery } from "../../lib/utils";
import styles from "./index.module.scss";
import { H3 } from "../../common-components/H3/H3";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { ResendTodaysEmailLink } from "../../components/ResendEmailLink/ResendTodaysEmailLink";

interface Email {
  messageId: string;
  sendTime: Date;
}

interface User {
  email: string;
  publicId: string;
  verified: boolean;
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
          emails {
            messageId
          }
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
  const { verified, email, publicId, emails = [] } = data.userByPublicId || data.userByEmail;

  let infoBlock = null;
  if (verified) {
    if (selectedSyndications == null) {
      // selectedSyndications hasn't loaded yet. Display a generic message.
      infoBlock = (
        <H3>
          Your email address is <DynamicText>verified</DynamicText>.
        </H3>
      );
    } else if (selectedSyndications.size === 0) {
      infoBlock = (
        <Fragment>
          <H3>Your email address is <DynamicText>verified</DynamicText>.</H3>
          <H3>
            However, you are not subscribed to any comics, so you will not receive any emails.
            Subscribe to some below in order to receive comics every day.
          </H3>
        </Fragment>
      );
    } else {
      const uriEncodedEmail = encodeURIComponent(email);
      infoBlock = (
        <Fragment>
          <H3>Your email address is <DynamicText>verified</DynamicText>.</H3>
          <H3>You will get an email at <DynamicText>{formattedComicDeliveryTime()}</DynamicText> every day.</H3>
          {emails.length > 0 && (
            <H3><CommonLink href={`/user/emails?email=${uriEncodedEmail}`}>View past emails.</CommonLink></H3>
          )}
          <H3><ResendTodaysEmailLink email={email} isFirstEmail={emails.length === 0} /></H3>
        </Fragment>
      );
    }
  } else {
    if (isNewUser) {
      infoBlock = (
        <Fragment>
          <H3>A verification email was just sent to <DynamicText>{email}</DynamicText>.</H3>
          <H3><ResendVerificationEmailLink email={email} /></H3>
          <H3>You'll receive comics once you verify your email.</H3>
        </Fragment>
      );
    } else {
      infoBlock = (
        <Fragment>
          <H3>Your email address is <DynamicText>not verified</DynamicText>.</H3>
          <H3>Until you verify your email, you will not receive comics.</H3>
          <H3><ResendVerificationEmailLink email={email} /></H3>
        </Fragment>
      );
    }
  }

  return (
    <Layout title="My Account">
      <div className={styles.block}>
        <H3>
          Your email is <DynamicText>{email}</DynamicText>.
        </H3>
        {infoBlock}
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
