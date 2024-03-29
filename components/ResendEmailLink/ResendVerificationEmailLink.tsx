import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { mdiCheckCircle } from "@mdi/js";
import Icon from "@mdi/react";
import toast from "react-hot-toast";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { handleGraphQlResponse } from "../../lib/utils";
import { LoadingOverlay } from "../../common-components/LoadingOverlay/LoadingOverlay";
import styles from "./ResendEmailLink.module.scss";

interface Props {
  email: string;
}

type ResendVerificationEmailResult = {
  verifyEmail: boolean;
};

export const ResendVerificationEmailLink = (props: Props) => {
  const { email } = props;
  const [sentEmail, setSentEmail] = useState(false);

  const mutation = gql`
    mutation resendVerificationEmail($email: String!) {
      resendVerificationEmail(email: $email)
    }
  `;
  const [
    resendVerificationEmailMutation,
    { loading: verificationEmailIsSending },
  ] = useMutation<ResendVerificationEmailResult>(mutation, {
    variables: { email },
  });

  if (sentEmail) {
    return (
      <>
        <Icon path={mdiCheckCircle} size={1} className={styles.successIcon} />
        Verification email re-sent.
      </>
    );
  }
  if (verificationEmailIsSending) {
    return (
      <>
        <LoadingOverlay />
        Re-sending verification email...
      </>
    );
  }
  return (
    <CommonLink
      onClick={async () => {
        const result =
          await handleGraphQlResponse<ResendVerificationEmailResult>(
            resendVerificationEmailMutation(),
          );
        if (result.success) {
          setSentEmail(true);
        } else {
          toast.error(
            `Could not send verification email: ${result.combinedErrorMessage}`,
          );
        }
      }}
    >
      Resend verification email.
    </CommonLink>
  );
};
