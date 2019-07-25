import * as React from "react";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { Layout } from "../common-components/Layout/Layout";
import styles from "./faq.module.scss";

const FAQPage: React.FunctionComponent = () => (
  <Layout title="FAQ">
    <p className={styles.question}>Do I get to choose which syndications to get?
    </p>
    <p className={styles.answer}>Yes-- you can choose to subscribe to whichever
      ones you like, from just your one favorite strip to every single
      one you used to read in the papers. We currently offer <b>440</b> syndications, but
      this regularly increases as we build a larger database in
      response to your requests. Regardless of how many comics you
      subscribe to, they'll all come together as one daily email.</p>
    <p className={styles.question}>When do I get my emails?</p>
    <p className={styles.answer}>Every daily email comes at 5 AM Eastern
      Time (GMT-4/GMT-5), so that you can enjoy your comics during your
      morning coffee.</p>
    <p className={styles.question}>Why didn't I get an email today?</p>
    <p className={styles.answer}>Not all syndications are updated every day. If
      none of your syndications are updated, we won't bother you an
      empty email.</p>
    <p className={styles.question}>Which syndications do you offer?</p>
    <p className={styles.answer}>Head over to the <CommonLink lowercase href="./enter-email"
    >signup page</CommonLink> to see for yourself, and <CommonLink lowercase href="./contact"
    >tell us</CommonLink> if we're missing one of your
      favorites!</p>
    <p className={styles.question}>Are all of the comics new?</p>
    <p className={styles.answer}>For syndications that are out of publication, we
      recycle comics from many years ago in order, so that you can
      follow them as they were read years before. </p>
    <p className={styles.question}>How much does this cost?</p>
    <p className={styles.answer}>Nothing. It's totally free. And it always will
      be.</p>
    <p className={styles.question}>Do you ever put ads in the emails?</p>
    <p className={styles.answer}>Nope.</p>
    <p className={styles.question}>But then how do you make money?</p>
    <p className={styles.answer}>✨ Virtue is its own reward. ✨ <br />(Just kidding
      .) <br /> (But not really, because we don't make any money
      from this. We just made it for fun.)</p>
    <p className={styles.question}>Do the artists make money?</p>
    <p className={styles.answer}>Sadly, no. Since this is really just a free
      service with no ads that we made for fun using publicly
      available databases, there's no money
      involved at all. With this in mind we highly encourage you to
      support the artists themselves by other means!</p>
    <p className={styles.question}>I have another{styles.questionnot} listed here, or I
      have feedback I'd like to share.</p>
    <p className={styles.answer}>Please <CommonLink lowercase href="./contact" >
      get in touch</CommonLink> with us!</p>
  </Layout>
);

export default FAQPage;
