import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { mdiCheckCircle } from "@mdi/js";
import Icon from "@mdi/react";
import toast from "react-hot-toast";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { handleGraphQlResponse } from "../../lib/utils";
import styles from "./ResendEmailLink.module.scss";
import { ViewEmailLink } from "../ViewEmailLink/ViewEmailLink";
import { LoadingOverlay } from "../../common-components/LoadingOverlay/LoadingOverlay";

interface Props {
  email: string;
  isFirstEmail: boolean;
}

type EmailUserMutationResult = {
  emailUser: string;
};

export const ResendTodaysEmailLink = (props: Props) => {
  const { email, isFirstEmail } = props;
  const [messageId, setMessageId] = useState("");
  const [
    secondsUntilCanViewMessageInBrowser,
    setSecondsUntilCanViewMessageInBrowser,
  ] = useState<null | number>(null);
  const mutation = gql`
    mutation emailUser($email: String!, $options: EmailAllUsersOptions) {
      emailUser(email: $email, options: $options)
    }
  `;
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        secondsUntilCanViewMessageInBrowser != null &&
        secondsUntilCanViewMessageInBrowser > 0
      ) {
        setSecondsUntilCanViewMessageInBrowser(
          secondsUntilCanViewMessageInBrowser - 1,
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsUntilCanViewMessageInBrowser]);
  const [emailUserMutation, { loading: emailIsSending }] =
    useMutation<EmailUserMutationResult>(mutation, {
      variables: {
        email,
        options: {
          sendAllComics: true,
          mentionNotUpdatedComics: true,
          onlyIfWeHaventCheckedToday: false,
          includeLatestNewsItemEvenIfItsAlreadyBeenSent: false,
        },
      },
    });

  if (messageId) {
    return (
      <>
        <Icon path={mdiCheckCircle} size={1} className={styles.successIcon} />
        {isFirstEmail
          ? "Your first email has been sent. "
          : "Today's email has been re-sent. "}
        <br />
        {secondsUntilCanViewMessageInBrowser === 0 ? (
          <ViewEmailLink messageId={messageId}>
            View it in the browser.
          </ViewEmailLink>
        ) : (
          <>
            <LoadingOverlay />A link to view it will be available in{" "}
            {secondsUntilCanViewMessageInBrowser}{" "}
            {secondsUntilCanViewMessageInBrowser === 1 ? "second" : "seconds"}
            ...
          </>
        )}
      </>
    );
  }
  if (emailIsSending) {
    return (
      <>
        <LoadingOverlay />
        {isFirstEmail
          ? "Sending you your first email..."
          : "Re-sending today's email..."}
      </>
    );
  }
  return (
    <CommonLink
      onClick={async () => {
        const { success, result, combinedErrorMessage } =
          await handleGraphQlResponse<EmailUserMutationResult>(
            emailUserMutation(),
          );
        if (success && result && result.data) {
          setMessageId(result.data.emailUser);
          setSecondsUntilCanViewMessageInBrowser(5);
        } else {
          toast.error(`Could not send today's email: ${combinedErrorMessage}`);
        }
      }}
    >
      {isFirstEmail ? "Send me my first email." : "Re-send today's email."}
    </CommonLink>
  );
};
