import * as React from "react";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { Layout } from "../common-components/Layout/Layout";

const AboutPage: React.FunctionComponent = () => (
  <Layout title="About">
    <p>
      We are{" "}
      <CommonLink href="http://www.elijahcarrel.com/" isExternal>
        Elijah Carrel
      </CommonLink>{" "}
      and{" "}
      <CommonLink href="http://www.gabereiss.com/" isExternal>
        Gabe Reiss
      </CommonLink>
      . We created Inbox Comics for fun in our spare time in the summer of 2014
      before we both left for college, just because we wanted a simple paperless
      way to receive comics every day.
    </p>
    <p>
      We continue to develop it semi-actively in our spare time. See our{" "}
      <CommonLink href="/news">news</CommonLink> page for the latest updates.
      All code is open-source on{" "}
      <CommonLink
        isExternal
        href="https://github.com/elijahcarrel/inbox-comics"
      >
        our GitHub repository
      </CommonLink>
      .
    </p>
    <p>
      Check out the <CommonLink href="/faq">FAQ</CommonLink> for more info, and
      please <CommonLink href="/contact">get in touch</CommonLink> if you have
      any questions about the site or just want to say hi!
    </p>
  </Layout>
);

export default AboutPage;
