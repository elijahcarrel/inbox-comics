import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useState } from "react";
// @ts-ignore
import { useToasts } from "react-toast-notifications";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { handleGraphQlResponse, toastType } from "../../lib/utils";
import styles from "./ResendVerificationEmail.module.scss";

interface Props {
  email: string;
}

export const ResendVerificationEmailLink = (props: Props) => {
  const { email } = props;
  const { addToast } = useToasts();
  const [sentEmail, setSentEmail] = useState(false);

  const mutation = gql`
    mutation resendVerificationEmail($email: String!) {
      resendVerificationEmail(email: $email)
    }
  `;
  interface ResendVerificationEmailResponse {
    success: boolean;
  }
  const [
    resendVerificationEmailMutation,
    { loading: verificationEmailIsSending },
  ] = useMutation<ResendVerificationEmailResponse>(mutation, { variables: { email } });

  if (sentEmail) {
    return <span className={styles.success}>Verification email re-sent.</span>;
  }
  if (verificationEmailIsSending) {
    return <span className={styles.warning}>Re-sending verification email...</span>;
  }
  return (
    <CommonLink
      onClick={async () => {
        // @ts-ignore
        const result = await handleGraphQlResponse(resendVerificationEmailMutation());
        if (result.success) {
          setSentEmail(true);
        } else {
          addToast(`Could not send verification email: ${result.combinedErrorMessage}`, toastType.error);
        }
      }}
      lowercase
    >
      Resend verification email.
    </CommonLink>
  );
};
