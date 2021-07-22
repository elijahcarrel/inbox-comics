import React from "react";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { Layout } from "../common-components/Layout/Layout";
import { H2 } from "../common-components/H2/H2";

const PrivacyPage: React.FunctionComponent = () => {
  return (
    <Layout title="Privacy">
      <p>
        Inbox Comics is a free service we built for fun. People like you find
        our website, subscribe to get daily emails from us and then unsubscribe
        at any time if they want. That&apos;s it.
      </p>
      <p>
        In order to send you emails, here&apos;s what we ask from you and
        here&apos;s what we do with your data once you give it to us.
      </p>
      <H2>We collect the following information about you:</H2>
      <ul>
        <li>Your email address, which you provide.</li>
        <li>
          The comics you are currently subscribed to (or were previously
          subscribed to), which you choose.
        </li>
        <li>
          Whether your subscription is active or whether you&apos;ve
          unsubscribed.
        </li>
        <li>Whether you&apos;ve verified your email address.</li>
        <li>The emails we send to you and their delivery status.</li>
      </ul>
      <H2>
        We don&apos;t, and never will, collect any of the following information
        about you:
      </H2>
      <ul>
        <li>Your IP address.</li>
        <li>Your password.</li>
        <li>
          Your name, location, gender, or any personal details of any kind.
        </li>
      </ul>
      <H2>We don&apos;t, and never will:</H2>
      <ul>
        <li>Use trackers.</li>
        <li>Sell your data.</li>
        <li>Serve ads.</li>
        <li>Make any money.</li>
      </ul>
      <H2>If any of this ever changes:</H2>
      <ul>
        <li>We&apos;ll email you.</li>
      </ul>
      <H2>If you&apos;re unhappy with this:</H2>
      <ul>
        <li>
          Unsubscribe at any time by heading to your{" "}
          <CommonLink href="/user/edit">account page</CommonLink>.
        </li>
        <li>
          <CommonLink href="/contact">Contact us</CommonLink>.
        </li>
      </ul>
    </Layout>
  );
};

export default PrivacyPage;
