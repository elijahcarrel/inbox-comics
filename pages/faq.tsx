import React, { ReactNode } from "react";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { DynamicText } from "../common-components/DynamicText/DynamicText";
import { Layout } from "../common-components/Layout/Layout";
import { formattedComicDeliveryTime } from "../lib/utils";
import styles from "./faq.module.scss";

type FaqEntry = {
  question: ReactNode;
  answer: ReactNode;
};

const FAQPage: React.FunctionComponent = () => {
  const entries: FaqEntry[] = [
    {
      question: <>Do I get to choose which syndications to get?</>,
      answer: (
        <>
          Yes— you can choose to subscribe to whichever ones you like, from just
          your one favorite strip to every single one you used to read in the
          papers. We currently offer <DynamicText>439</DynamicText>{" "}
          syndications, but this regularly increases as we build a larger
          database in response to your requests. Regardless of how many comics
          you subscribe to, they&apos;ll all come together as one daily email.
        </>
      ),
    },
    {
      question: <>When do I get my emails?</>,
      answer: (
        <>
          Every daily email comes at{" "}
          <DynamicText>{formattedComicDeliveryTime()}</DynamicText>. We decided
          on that time because most dailies are posted before then, and
          it&apos;s still early enough that even the early risers on the east
          coast of the U.S. can enjoy the comics over their morning coffee.
        </>
      ),
    },
    {
      question: <>Why didn&apos;t I get an email today?</>,
      answer: (
        <>
          Not all syndications are updated every day. If none of your
          syndications are updated, we won&apos;t bother you an empty email. You
          can always request to get your email re-sent by heading to your{" "}
          <CommonLink href="/user/edit">account page</CommonLink>. When you
          request to get an email re-sent, we&apos;ll send it with all the
          comics included, even those that haven&apos;t been updated since
          yesterday.
        </>
      ),
    },
    {
      question: <>Which syndications do you offer?</>,
      answer: (
        <>
          Head over to the{" "}
          <CommonLink href="/user/new">sign-up page</CommonLink> to see for
          yourself, and <CommonLink href="/contact">tell us</CommonLink> if
          we&apos;re missing one of your favorites!
        </>
      ),
    },
    {
      question: <>Are all of the comics new?</>,
      answer: (
        <>
          For syndications that are out of publication, we recycle comics from
          many years ago in order, so that you can follow them as they were read
          years before.
        </>
      ),
    },
    {
      question: <>How much does this cost?</>,
      answer: <>Nothing. It&apos;s totally free.</>,
    },
    {
      question: <>Are there ads in the emails?</>,
      answer: <>Nope.</>,
    },
    {
      question: <>Do the artists make money?</>,
      answer: (
        <>
          Sadly, no. We just use publicly accessible databases, so there&apos;s
          no money involved at all. With this in mind we highly encourage you to
          support the artists themselves by other means!
        </>
      ),
    },
    {
      question: (
        <>
          I have another question not listed here, or I have feedback I&apos;d
          like to share.
        </>
      ),
      answer: (
        <>
          Please <CommonLink href="/contact"> get in touch</CommonLink> with us!
        </>
      ),
    },
  ];
  return (
    <Layout title="FAQ">
      {entries.map(({ question, answer }) => (
        <>
          <p className={styles.question}>{question}</p>
          <p className={styles.answer}>{answer}</p>
        </>
      ))}
    </Layout>
  );
};

export default FAQPage;
