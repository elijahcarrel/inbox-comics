import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Router from "next/router";
import React, { useState } from "react";
// @ts-ignore
import { useToasts } from "react-toast-notifications";
import { Button } from "../common-components/Button/Button";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { Layout } from "../common-components/Layout/Layout";
import { TextInput } from "../common-components/TextInput/TextInput";
import { handleGraphQlResponse, toastType } from "../lib/utils";
import styles from "./contact.module.scss";

const ContactPage: React.FunctionComponent = () => {
  const { addToast } = useToasts();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const mutation = gql`
    mutation submitContactForm {
      submitContactForm(email: "${email}", name: "${name}", subject: "${subject}", message: "${message}")
    }
  `;
  const [submitContactFormMutation] = useMutation(mutation);

  return (
    <Layout title="Contact" isLoading={isLoading}>
      <p>We'd love to hear from you!</p>
      <p>You can also reach us by replying to any of your daily comic emails, or by emailing us at{" "}
        <CommonLink lowercase href="mailto:hello@inboxcomics.com">hello@inboxcomics.com</CommonLink>.
      </p>
      <div className={styles.contactForm}>
        <TextInput
          name="name"
          placeholder="Name"
          value={name}
          onChange={setName}
          className={styles.textInput}
        />
        <br />
        <TextInput
          name="email"
          placeholder="Email"
          value={email}
          onChange={setEmail}
          className={styles.textInput}
        />
        <br />
        <TextInput
          name="subject"
          placeholder="Subject"
          value={subject}
          onChange={setSubject}
          className={styles.textInput}
        />
        <br />
        <TextInput
          name="message"
          placeholder="Message"
          value={message}
          onChange={setMessage}
          className={styles.textInput}
          multiline
        />
        <br />
        <Button
          onClick={async () => {
            setIsLoading(true);
            const result = await handleGraphQlResponse(submitContactFormMutation());
            const { success, combinedErrorMessage } = result;
            if (success) {
              addToast("Thank you! We'll get back to you in a jiffy.", toastType.success);
              await Router.push({
                pathname: "/",
                query: {},
              });
              setIsLoading(false);
            } else {
              addToast(combinedErrorMessage, toastType.error);
              setIsLoading(false);
            }
          }}
        >
          Go
        </Button>
      </div>
    </Layout>
  );
};

export default ContactPage;
