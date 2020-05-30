import * as React from "react";
import { CallToAction } from "../common-components/CallToAction/CallToAction";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { DynamicText } from "../common-components/DynamicText/DynamicText";
import { H3 } from "../common-components/H3/H3";
import { Layout } from "../common-components/Layout/Layout";
import styles from "./index.module.scss";

const IndexPage: React.FunctionComponent = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.explanation}>
          <H3 bold>Your choice of 400+ comic and webcomic syndications.</H3>
          <H3>Bundled and emailed to you each morning.</H3>
          <H3>With no ads.</H3>
          <H3>And it's completely free.</H3>
          <H3 bold className={styles.extraMargin}>Choose from:</H3>
          <div className={styles.comicTeaserList}>
            {[
              "Calvin and Hobbes", "xkcd", "Garfield", "Pearls before Swine", "Pickles",
              "Dilbert", "Cyanide and Happiness", "B.C.", "Hagar the Horrible", "Get Fuzzy",
              "Family Circus", "PHD Comics", "Poorly Drawn Lines", "Blondie",
              "Saturday Morning Breakfast Cereal", "Dinosaur Comics", "Non Sequitur",
              "Hi and Lois", "Bizarro", "Frazz", "Zits", "Baby Blues", "Dustin", "Pooch Cafe",
              "Beetle Bailey", "Wizard of Id", "Ziggy", "Dennis the Menace", "Luann",
            ].map((syndicationName: string) => (
              <DynamicText className={styles.comicTeaserListItem} key={syndicationName}>{syndicationName}</DynamicText>
            ))}
          </div>
          <div>
            <p>... and many more.</p>
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
        Get Started →
      </CallToAction>
      <H3 className={styles.extraMargin}>
        Or, if you'd prefer, <CommonLink href="/faq">read the FAQ</CommonLink> before you jump right in.
      </H3>
    </Layout>
  );
};

export default IndexPage;
