import { useQuery } from "@apollo/react-hooks";
import classNames from "classnames";
import gql from "graphql-tag";
import * as React from "react";
import { CommonLink } from "../common-components/CommonLink/CommonLink";
import { Layout } from "../common-components/Layout/Layout";
import { Subtitle } from "../common-components/Subtitle/Subtitle";
import { stringifyGraphQlError } from "../lib/utils";
import styles from "./news.module.scss";

interface NewsItem {
  identifier: string;
  createTime: Date;
  headline: string;
  content: string;
}

interface NewsItemResponse {
  getNews: NewsItem[];
}

const newsQuery = gql`
  query getNews {
    getNews {
      identifier
      createTime
      headline
      content
    }
  }
`;

const title = "News";

const NewsPage: React.FunctionComponent = () => {

  const newsQueryResponse = useQuery<NewsItemResponse>(newsQuery);
  const { data, error, loading } = newsQueryResponse;
  if (error) {
    return <Layout title={title} error={stringifyGraphQlError(error)} />;
  }

  if (loading || !data || !data.getNews) {
    return <Layout title={title} isLoading />;
  }
  const { getNews: newsItems } = data;

  return (
    <Layout title={title}>
      <div className={styles.newsItemsContainer}>
        {newsItems.map(({ identifier, createTime, headline, content }, index) => {
          const isLastItem = index === newsItems.length - 1;
          return (
            <div className={classNames(styles.newsItem, { isLastItem })}>
              <Subtitle className={styles.headline}>{headline}</Subtitle>
              <div className={styles.date}>
                <CommonLink href={`/news/item?identifier=${identifier}`}>{createTime}</CommonLink>
              </div>
              <div className={styles.content}>{content}</div>
              <div className={styles.readMore}>
                <CommonLink href={`/news/item?identifier=${identifier}`} lowercase>Read more &gt;&gt;</CommonLink>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default NewsPage;
