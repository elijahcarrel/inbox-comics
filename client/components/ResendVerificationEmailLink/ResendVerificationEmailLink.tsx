import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, { useState } from "react";
import Alert from "react-s-alert";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { handleGraphQlResponse } from "../../lib/utils";
import styles from "./ResendVerificationEmail.module.scss";

interface Props {
  email: string;
}

export const ResendVerificationEmailLink = (props: Props) => {
  const { email } = props;
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
    return <span className={styles.success}>Verification email sent.</span>;
  }
  if (verificationEmailIsSending) {
    return <span className={styles.warning}>Sending verification email...</span>;
  }
  return (
    <CommonLink
      onClick={async () => {
        // @ts-ignore
        const result = await handleGraphQlResponse(resendVerificationEmailMutation());
        if (result.success) {
          setSentEmail(true);
        } else {
          Alert.error(`Email could not be sent: ${result.error}`);
        }
      }}
      lowercase
    >
      Resend verification email.
    </CommonLink>
  );
};
