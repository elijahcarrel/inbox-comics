import * as React from "react";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { DynamicText } from "../common-components/DynamicText/DynamicText";
import { Layout } from "../common-components/Layout/Layout";
import { formattedComicDeliveryTime } from "../lib/utils";
import styles from "./faq.module.scss";

const FAQPage: React.FunctionComponent = () => (
  <Layout title="FAQ">
    <p className={styles.question}>Do I get to choose which syndications to get?
    </p>
    <p className={styles.answer}>Yes— you can choose to subscribe to whichever
      ones you like, from just your one favorite strip to every single
      one you used to read in the papers. We currently offer{" "}
      <DynamicText>440</DynamicText> syndications, but
      this regularly increases as we build a larger database in
      response to your requests. Regardless of how many comics you
      subscribe to, they'll all come together as one daily email.</p>
    <p className={styles.question}>When do I get my emails?</p>
    <p className={styles.answer}>Every daily email comes at{" "}
      <DynamicText>{formattedComicDeliveryTime()}</DynamicText>.
      We decided on that time because most dailies are posted before then, and
      it's still early enough that even the early risers on the east coast of the U.S.
      can enjoy the comics over their morning coffee.</p>
    <p className={styles.question}>Why didn't I get an email today?</p>
    <p className={styles.answer}>Not all syndications are updated every day. If
      none of your syndications are updated, we won't bother you an
      empty email.</p>
    <p className={styles.question}>Which syndications do you offer?</p>
    <p className={styles.answer}>Head over to the <CommonLink lowercase href="/user/new"
    >sign-up page</CommonLink> to see for yourself, and <CommonLink lowercase href="/contact"
    >tell us</CommonLink> if we're missing one of your
      favorites!</p>
    <p className={styles.question}>Are all of the comics new?</p>
    <p className={styles.answer}>For syndications that are out of publication, we
      recycle comics from many years ago in order, so that you can
      follow them as they were read years before. </p>
    <p className={styles.question}>How much does this cost?</p>
    <p className={styles.answer}>Nothing. It's totally free.</p>
    <p className={styles.question}>Are there ads in the emails?</p>
    <p className={styles.answer}>Nope.</p>
    <p className={styles.question}>But then how do you make money?</p>
    <p className={styles.answer}>We don't. ✨Virtue is its own reward.✨ (In other words, we just made this for fun.)</p>
    <p className={styles.question}>Do the artists make money?</p>
    <p className={styles.answer}>Sadly, no. We just use publicly accessible databases,
      so there's no money involved at all. With this in mind we highly encourage you to
      support the artists themselves by other means!</p>
    <p className={styles.question}>I have another question not listed here, or I
      have feedback I'd like to share.</p>
    <p className={styles.answer}>Please <CommonLink lowercase href="/contact" >
      get in touch</CommonLink> with us!</p>
  </Layout>
);

export default FAQPage;
