import classNames from "classnames";
import parse, { domToReact } from "html-react-parser";
import { Moment } from "moment";
import React, { Fragment } from "react";
import Truncate from "react-truncate";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { Subtitle } from "../../common-components/Subtitle/Subtitle";
import styles from "./NewsItem.module.scss";

interface Props {
  identifier: string;
  createTime: Moment;
  headline: string;
  content: string;
  previewOnly: boolean;
  isLastItem?: boolean;
}

interface NewsItemContentProps {
  content: string;
  previewOnly: boolean;
}

const NewsItemContent = (props: NewsItemContentProps) => {
  const { content, previewOnly } = props;
  const parsedNode = parse(content, {
    replace: (domNode) => {
      if (domNode.type === "tag" && domNode.name === "a") {
        const href = (domNode.attribs || {}).href;
        return <CommonLink href={href} lowercase>{domToReact(domNode.children || [])}</CommonLink>;
      }
    },
  });
  if (previewOnly) {
    return (
      <Truncate
        lines={3}
        ellipsis={
          <span>
            ...
          </span>
        }>
        {parsedNode}
      </Truncate>
    );
  }
  return <Fragment>{parsedNode}</Fragment>;
};

export const NewsItem = (props: Props) => {
  const { identifier, createTime, headline, content, previewOnly, isLastItem = false } = props;
  const formattedCreateTime = createTime.format("dddd, MMMM Do, YYYY, h:mm a");
  return (
    <div className={styles.newsItemContainer} key={identifier}>
      <div className={classNames(styles.newsItem, { [styles.isNotLastItem]: !isLastItem && previewOnly })}>
        <Subtitle className={styles.headline}>{headline}</Subtitle>
        <div className={styles.date}>
          <CommonLink href={`/news/${identifier}`} className={styles.dateLink} lowercase>
            {formattedCreateTime}
          </CommonLink>
        </div>
        <div className={classNames(styles.content, { [styles.previewOnly]: previewOnly })}>
          <NewsItemContent content={content} previewOnly={previewOnly} />
        </div>
        {previewOnly && (
          <div className={styles.readMore}>
            <CommonLink href={`/news/${identifier}`} lowercase>Read more &gt;&gt;</CommonLink>
          </div>
        )}
      </div>
    </div>
  );
};
