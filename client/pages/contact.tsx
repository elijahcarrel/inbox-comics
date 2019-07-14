import * as React from "react";
import { Layout } from "../common-components/Layout/Layout";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { Title } from "../common-components/Title/Title";
import { TextInput } from "../common-components/TextInput/TextInput";
import styles from "./contact.module.scss";


const ContactPage: React.FunctionComponent = () => (
  <Layout title="Contact">
    <Title>Contact</Title>
    <div className={styles.contactForm}>
      <p class="contacttext">We'd love to hear from you!</p>
      <p class="contacttext">You can also reach us by replying to any of your daily comic emails, or by emailing us at  <CommonLink lowercase href="mailto:hello@inboxcomics.com">hello@inboxcomics.com</CommonLink>.</p>
      <TextInput name="Name"/> < br/>
      <TextInput name="Email Address"/> < br/>
      <TextInput name="Subject"/> < br/>
      <TextInput name="Message"/> < br/> 
      <input type="submit" />         
    </div>
  </Layout>
);

export default ContactPage;
