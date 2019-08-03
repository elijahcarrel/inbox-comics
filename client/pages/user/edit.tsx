import Router from "next/router";
import React, { useState } from "react";
import { Button } from "../../common-components/Button/Button";
import { Layout } from "../../common-components/Layout/Layout";
import { TextInput } from "../../common-components/TextInput/TextInput";
import styles from "./edit.module.scss";

const EditUserPage: React.FunctionComponent = () => {
  const [email, setEmail] = useState("");
  return (
    <Layout title="Edit Subscriptions">
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

export default EditUserPage;
