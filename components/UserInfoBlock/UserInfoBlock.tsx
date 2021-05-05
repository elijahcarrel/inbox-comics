import React, { useState } from "react";
import { H3 } from "../../common-components/H3/H3";
import { DynamicText } from "../../common-components/DynamicText/DynamicText";
import { formattedComicDeliveryTime } from "../../lib/utils";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { ResendTodaysEmailLink } from "../ResendEmailLink/ResendTodaysEmailLink";
import { ResendVerificationEmailLink } from "../ResendEmailLink/ResendVerificationEmailLink";
import { AccountEnabledSection } from "./AccountEnabledSection";
import { AccountEmailBlock } from "./AccountEmailBlock";

export interface Email {
  messageId: string;
  sendTime: Date;
}

interface Props {
  verified: boolean;
  enabled: boolean;
  email: string;
  publicId: string;
  emails: Email[] | undefined;
  selectedSyndications: string[] | null;
  isNewUser: boolean;
  hasJustChangedEmail: boolean;
}

export const UserInfoBlock = (props: Props) => {
  const {
    verified,
    enabled: currentEnabledValue,
    email,
    publicId,
    emails = [],
    selectedSyndications,
    isNewUser,
    hasJustChangedEmail,
  } = props;

  const [newEnabledValue, setNewEnabledValue] = useState<boolean | undefined>();
  // Optimistically update UI as soon as a new enabled value is set.
  const enabled =
    newEnabledValue != null ? newEnabledValue : currentEnabledValue;

  let infoBlock = (
    <>
      <AccountEmailBlock email={email} publicId={publicId} />
    </>
  );

  const uriEncodedEmail = encodeURIComponent(email);
  const pastEmailsBlock = (
    <>
      {emails.length > 0 && (
        <H3>
          <CommonLink href={`/user/emails?email=${uriEncodedEmail}`}>
            View past emails.
          </CommonLink>
        </H3>
      )}
    </>
  );

  // The next thing we check is whether the user's email is verified. If not, we
  // simply ask them to verify their email.

  // We don't bother displaying the AccountEnabledSection as it is useless to
  // them (enabling/disabling doesn't matter if they are unverified), and we
  // also don't check the number of syndications (because again,
  // adding/subtracting comments doesn't matter if they're unverified).
  if (!verified) {
    // However, we first, check if the user is a new user who has just completed
    // registration, or a user who has just changed their email. If so, we
    // indicate that we've just sent them a verification email and ask them to
    // verify it.
    if (isNewUser || hasJustChangedEmail) {
      return (
        <>
          {infoBlock}
          <H3>
            A verification email was just sent to{" "}
            <DynamicText>{email}</DynamicText>.
          </H3>
          <H3>
            <ResendVerificationEmailLink email={email} />
          </H3>
          <H3>
            You&apos;ll receive comics once you verify your
            {hasJustChangedEmail ? " new " : " "}email.
          </H3>
          {pastEmailsBlock}
        </>
      );
    }

    // If they are not a new user or a user who has just changed their email, we
    // simply tell them their email isn't verified and ask them to verify it.
    return (
      <>
        {infoBlock}
        <H3>
          Your email address is <DynamicText>not verified</DynamicText>.
        </H3>
        <H3>
          Until you verify your email, you will not receive comics (or any other
          emails from our service).
        </H3>
        <H3>
          <ResendVerificationEmailLink email={email} />
        </H3>
        {pastEmailsBlock}
      </>
    );
  }

  // By this point, the user is verified. All info text should be prepended with
  // information saying so. We should also display the AccountEnabledSection which
  // handles telling the user whether their account is enabled or not and
  // allowing them to change it.
  infoBlock = (
    <>
      {infoBlock}
      <H3>
        Your email address is <DynamicText>verified</DynamicText>.
      </H3>
      <AccountEnabledSection
        publicId={publicId}
        enabled={enabled}
        onSetNewEnabledValue={setNewEnabledValue}
        email={email}
      />
    </>
  );

  if (!enabled) {
    // If the user isn't enabled, return info block and past emails block since
    // any further information won't matter.
    return (
      <>
        {infoBlock} {pastEmailsBlock}
      </>
    );
  }

  if (selectedSyndications == null) {
    // selectedSyndications hasn't loaded yet. Return info block unchanged as a
    // generic message until selectedSyndications loads.
    return (
      <>
        {infoBlock} {pastEmailsBlock}
      </>
    );
  }
  if (selectedSyndications.length === 0) {
    return (
      <>
        {infoBlock}
        <H3>
          However, you are not subscribed to any comics, so you will{" "}
          {emails.length > 0 ? "no longer " : "not "}
          receive any emails. Subscribe to some below in order to receive comics
          every day.
        </H3>
        {pastEmailsBlock}
      </>
    );
  }

  // At this point, the user's account is verified, enabled, and they subscribe
  // to at least one comic-- we should tell them to expect to receive emails!
  return (
    <>
      {infoBlock}
      <H3>
        You will get an email at{" "}
        <DynamicText>{formattedComicDeliveryTime()}</DynamicText> every day.
      </H3>
      {pastEmailsBlock}
      <H3>
        <ResendTodaysEmailLink
          email={email}
          isFirstEmail={emails.length === 0}
        />
      </H3>
    </>
  );
};
