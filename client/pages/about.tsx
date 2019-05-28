import * as React from "react";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { Layout } from "../common-components/Layout/Layout";
import { Title } from "../common-components/Title/Title";

const AboutPage: React.FunctionComponent = () => (
  <Layout title="About">
    <Title>About</Title>
    <p>
      We are
      {" "}<CommonLink href="http://www.elijahcarrel.com/" lowercase>Elijah Carrel</CommonLink>{" "}
      and
      {" "}<CommonLink href="http://www.gabereiss.com/" lowercase>Gabe Reiss</CommonLink>.
      We created Inbox Comics for fun in our spare time in the summer of 2014
      before we both left for college,
      just because we wanted a simple paperless way to receive comics every day.</p>
    <p>
      While we are no longer developing it as actively we did that summer, we regularly
      improve the service in our spare time. We continue
      to deliver thousands of comics to our users every morning, and we plan on doing
      so for many years to come.
    </p>
    <p>
      Check out the
      {" "}<CommonLink href="/" lowercase>FAQ</CommonLink>{" "}
      or the
      {" "}<CommonLink href="https://www.facebook.com/inboxcomics/" lowercase>Facebook page</CommonLink>{" "}
      for more info, and please
      {" "}<CommonLink href="/" lowercase>get in touch</CommonLink>{" "}
      if you have any questions about the site or just want to say hi!
    </p>
  </Layout>
);

export default AboutPage;
