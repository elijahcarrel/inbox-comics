import classNames from "classnames";
import * as React from "react";
import { CallToAction } from "../common-components/CallToAction/CallToAction";
import { DynamicText } from "../common-components/DynamicText/DynamicText";
import { Layout } from "../common-components/Layout/Layout";
import styles from "./index.module.scss";
import {CommonLink} from "../common-components/CommonLink/CommonLink";

const IndexPage: React.FunctionComponent = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.explanation}>
          <p className={classNames(styles.explanationText, styles.bold)}>Your choice of 400+ comic and webcomic syndications.</p>
          <p className={styles.explanationText}>Bundled and emailed to you each morning.</p>
          <p className={styles.explanationText}>With no ads.</p>
          <p className={styles.explanationText}>And it's completely free.</p>
          <p className={classNames(styles.explanationText, styles.bold, styles.extraMargin)}>Choose from:</p>
          <div className={styles.comicTeaserList}>
            {[
              "Calvin and Hobbes", "xkcd", "Garfield", "Pearls before Swine", "Pickles",
              "Dilbert", "Cyanide and Happiness", "B.C.", "Hagar the Horrible", "Get Fuzzy",
              "Family Circus", "PHD Comics", "Poorly Drawn Lines", "Blondie",
              "Saturday Morning Breakfast Cereal", "Dinosaur Comics", "Non Sequitur",
              "Hi and Lois", "Bizarro", "Frazz", "Zits", "Baby Blues", "Dustin", "Pooch Cafe",
              "Beetle Bailey", "Wizard of Id", "Ziggy", "Dennis the Menace", "Luann",
            ].map((syndicationName: string) => (
              <DynamicText className={styles.comicTeaserListItem}>{syndicationName}</DynamicText>
            ))}
          </div>
          <div>
            <p className={styles.explanationText}>... and many more.</p>
          </div>
        </div>
        <div className={styles.emailExampleContainer}>
          <img
            src="/static/images/narrow_serif.png"
            className={styles.emailExample}
            srcSet="/static/images/narrow_serif@2x.png 2x"
          />
        </div>
      </div>
      <CallToAction
        isSticky
        href="/user/new"
      >
        Explore our catalog and sign up. →
      </CallToAction>
      <p className={classNames(styles.explanationText, styles.extraMargin)}>
        Or, if you'd prefer, <CommonLink lowercase href="/faq">read the FAQ</CommonLink> before you jump right in.
      </p>
    </Layout>
  );
};

export default IndexPage;
