import React, { useState } from "react";
import { H3 } from "../../common-components/H3/H3";
import { DynamicText } from "../../common-components/DynamicText/DynamicText";
import { formattedComicDeliveryTime } from "../../lib/utils";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { ResendTodaysEmailLink } from "../ResendEmailLink/ResendTodaysEmailLink";
import { ResendVerificationEmailLink } from "../ResendEmailLink/ResendVerificationEmailLink";
import { AccountEnabledSection } from "./AccountEnabledSection";

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
  selectedSyndications: Set<string> | null;
  isNewUser: boolean;
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
  } = props;

  const [newEnabledValue, setNewEnabledValue] = useState<boolean | undefined>();
  // Optimistically update UI as soon as a new enabled value is set.
  const enabled =
    newEnabledValue != null ? newEnabledValue : currentEnabledValue;

  // First, check if the user is a new user who has just completed registration.
  // If so, we can assume that the user is enabled but not verified and display
  // the same message without checking anything else.
  if (isNewUser) {
    return (
      <>
        <H3>
          A verification email was just sent to{" "}
          <DynamicText>{email}</DynamicText>.
        </H3>
        <H3>
          <ResendVerificationEmailLink email={email} />
        </H3>
        <H3>You&apos;ll receive comics once you verify your email.</H3>
      </>
    );
  }
  // If they are not a new user, the next thing we check is whether the user's
  // email is verified. If not, we simply ask them to verify their email.
  //
  // Since we assume users only go from unverified to verified, we do not need
  // to consider any other cases (i.e. whether the user is "enabled" or not,
  // because we have never given them the option to disable it, or whether the
  // user has received any past emails or not, because we assume they haven't).
  if (!verified) {
    return (
      <>
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
      </>
    );
  }

  // By this point, the user is verified. All info text should be prepended with
  // information saying so.
  let infoBlock = (
    <>
      <H3>
        Your email address is <DynamicText>verified</DynamicText>.
      </H3>
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

  // At this point, we should also display the AccountEnabledSection which
  // handles telling the user whether their account is enabled or not and
  // allowing them to change it.
  infoBlock = (
    <>
      {infoBlock}
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
  if (selectedSyndications.size === 0) {
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
  // to at least one comic.
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
