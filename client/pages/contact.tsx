import React, { useState } from "react";
import { Button } from "../common-components/Button/Button";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { Layout } from "../common-components/Layout/Layout";
import { TextInput } from "../common-components/TextInput/TextInput";
import styles from "./contact.module.scss";

const ContactPage: React.FunctionComponent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  return (
    <Layout title="Contact">
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
        <Button>
          Go
        </Button>
      </div>
    </Layout>
  );
};

export default ContactPage;
