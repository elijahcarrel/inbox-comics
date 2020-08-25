import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { CommonLink } from "../../common-components/CommonLink/CommonLink";
import { Layout } from "../../common-components/Layout/Layout";
import { NewsItem } from "../../components/NewsItem/NewsItem";
import { stringifyGraphQlError, useNonEmptyUrlQuery } from "../../lib/utils";

interface INewsItem {
  identifier: string;
  createTime: Date;
  headline: string;
  content: string;
}

interface NewsItemResponse {
  getNewsItem: INewsItem;
}

const title = "News";

const NewsPage: React.FunctionComponent = () => {
  const [urlQuery, urlQueryIsReady] = useNonEmptyUrlQuery();
  const identifier = `${urlQuery.identifier}`;

  const newsQuery = gql`
    query getNewsItem {
      getNewsItem(identifier: "${identifier}") {
        identifier
        createTime
        headline
        content
      }
    }
  `;
  const newsQueryResponse = useQuery<NewsItemResponse>(newsQuery, {
    skip: !urlQueryIsReady,
  });

  const { data, error, loading } = newsQueryResponse;
  if (error) {
    return <Layout title={title} error={stringifyGraphQlError(error)} />;
  }

  if (loading || !data || !data.getNewsItem) {
    return <Layout title={title} isLoading />;
  }
  const { getNewsItem: newsItem } = data;
  const { createTime, headline, content } = newsItem;
  return (
    <Layout title={title}>
      <CommonLink href="/news">&lt;&lt; Back to all news</CommonLink>
      <NewsItem
        identifier={identifier}
        createTime={createTime}
        headline={headline}
        isLastItem={false}
        previewOnly={false}
        content={content}
      />
    </Layout>
  );
};

export default NewsPage;
