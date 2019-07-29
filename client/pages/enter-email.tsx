import Router from "next/router";
import React, { useState } from "react";
import { Button } from "../common-components/Button/Button";
import { Layout } from "../common-components/Layout/Layout";
import { TextInput } from "../common-components/TextInput/TextInput";
import styles from "./enter-email.module.scss";

const EnterEmailPage: React.FunctionComponent = () => {
  const [email, setEmail] = useState("");
  return (
    <Layout title="Enter Email">
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
          onClick={() => {
            Router.push({
              pathname: "/user",
              query: { email },
            });
          }}
          className={styles.button}
        >
          Go
        </Button>
      </div>
    </Layout>
  );
};

export default EnterEmailPage;
