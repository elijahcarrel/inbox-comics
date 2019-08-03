import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useState } from "react";
// @ts-ignore
import { useToasts } from "react-toast-notifications";
import { Button } from "../../common-components/Button/Button";
import { Layout } from "../../common-components/Layout/Layout";
import { TextInput } from "../../common-components/TextInput/TextInput";
import { handleGraphQlResponse, toastType } from "../../lib/utils";
import styles from "./new.module.scss";

const NewUserPage: React.FunctionComponent = () => {
  const { addToast } = useToasts();
  const [email, setEmail] = useState("");
  const mutation = gql`
    mutation createUser($email: String!) {
      createUser(email: $email) {
        email
        verified
      }
    }
  `;
  const [createUserMutation, { loading }] = useMutation(mutation);
  return (
    <Layout title="Sign Up" isLoading={loading} >
      <div className={styles.container}>
        <TextInput
          name="email"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="Email"
        />
        <br />
        <Button
          onClick={async () => {
            const result = await handleGraphQlResponse(createUserMutation({ variables: { email }}));
            const { success, combinedErrorMessage } = result;
            if (success) {
              Router.push({
                pathname: "/user",
                query: { email, new: true },
              });
            } else {
              addToast(combinedErrorMessage, toastType.error);
            }
          }}
          className={styles.button}
          disabled={loading}
        >
          Go
        </Button>
      </div>
    </Layout>
  );
};

export default NewUserPage;
