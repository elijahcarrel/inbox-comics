import classNames from "classnames";
import parse, { domToReact } from "html-react-parser";
import React, { Fragment } from "react";
import Truncate from "react-truncate";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { H2 } from "../../common-components/H2/H2";
import styles from "./NewsItem.module.scss";
import { format } from "date-fns";

interface Props {
  identifier: string;
  createTime: Date;
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
        const isExternal = !href.startsWith("/");
        return (
          <CommonLink
            href={href}
            isExternal={isExternal}
          >
            {domToReact(domNode.children || [])}
          </CommonLink>
        );
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
  const formattedCreateTime = format(createTime, "EEEE, LLLL do, yyyy, h:mm a");
  return (
    <div className={styles.newsItemContainer} key={identifier}>
      <div className={classNames(styles.newsItem, { [styles.isNotLastItem]: !isLastItem && previewOnly })}>
        <H2 className={styles.headline}>{headline}</H2>
        <div className={styles.date}>
          <CommonLink href={`/news/${identifier}`} className={styles.dateLink}>
            {formattedCreateTime}
          </CommonLink>
        </div>
        <div className={classNames(styles.content, { [styles.previewOnly]: previewOnly })}>
          <NewsItemContent content={content} previewOnly={previewOnly} />
        </div>
        {previewOnly && (
          <div className={styles.readMore}>
            <CommonLink href={`/news/${identifier}`}>Read more &gt;&gt;</CommonLink>
          </div>
        )}
      </div>
    </div>
  );
};
