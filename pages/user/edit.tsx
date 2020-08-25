import Router from "next/router";
import React, { useState } from "react";
import { Button } from "../../common-components/Button/Button";
import { Layout } from "../../common-components/Layout/Layout";
import { TextInput } from "../../common-components/TextInput/TextInput";
import styles from "./edit.module.scss";

const EditUserPage: React.FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <Layout title="My Account">
      <form className={styles.container} onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true);
        await Router.push({
          pathname: "/user",
          query: { email },
        });
      }}>
        <TextInput
          name="email"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="Email"
        />
        <br />
        <Button
          type="submit"
          className={styles.button}
          disabled={isSubmitting}
        >
          Go
        </Button>
      </form>
    </Layout>
  );
};

export default EditUserPage;
