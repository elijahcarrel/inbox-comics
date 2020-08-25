import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useToasts } from "react-toast-notifications";
import { mdiCheckCircle } from "@mdi/js";
import Icon from "@mdi/react";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { handleGraphQlResponse, toastType } from "../../lib/utils";
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
  const { addToast } = useToasts();
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
        const result = await handleGraphQlResponse<
          ResendVerificationEmailResult
        >(resendVerificationEmailMutation());
        if (result.success) {
          setSentEmail(true);
        } else {
          addToast(
            `Could not send verification email: ${result.combinedErrorMessage}`,
            toastType.error,
          );
        }
      }}
    >
      Resend verification email.
    </CommonLink>
  );
};
