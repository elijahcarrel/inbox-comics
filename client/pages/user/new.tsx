import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useState } from "react";
import { Button } from "../../common-components/Button/Button";
import { Layout } from "../../common-components/Layout/Layout";
import { TextInput } from "../../common-components/TextInput/TextInput";
import styles from "./new.module.scss";

// @ts-ignore: property 'mutate' does not exist on type '{ children?: ReactNode; }'
const NewUserPage: React.FunctionComponent = ({ mutate }) => {
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
            // @ts-ignore
            const { data: { createUser: { email: createdEmail } } } = await createUserMutation({ variables: { email }});
            if (createdEmail != null) {
              Router.push({
                pathname: "/user",
                query: { email: createdEmail },
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
