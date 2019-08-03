import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useState } from "react";
import { Button } from "../../common-components/Button/Button";
import { Layout } from "../../common-components/Layout/Layout";
import { TextInput } from "../../common-components/TextInput/TextInput";
import { handleGraphQlResponse } from "../../lib/utils";
import styles from "./new.module.scss";

const NewUserPage: React.FunctionComponent = () => {
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
    <Layout title="Sign Up">
      <div className={styles.container}>
        <TextInput
          name="email"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="Email"
          className={styles.textInput}
        />
        <br />
        <Button
          onClick={async () => {
            const { success } = await handleGraphQlResponse(createUserMutation({ variables: { email }}));
            if (success) {
              Router.push({
                pathname: "/user",
                query: { email, new: true },
              });
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
