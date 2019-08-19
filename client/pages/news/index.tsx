import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import moment from "moment";
import * as React from "react";
import { Layout } from "../../common-components/Layout/Layout";
import { NewsItem } from "../../components/NewsItem/NewsItem";
import { stringifyGraphQlError } from "../../lib/utils";

interface INewsItem {
  identifier: string;
  createTime: Date;
  headline: string;
  content: string;
}

interface NewsItemResponse {
  getNews: INewsItem[];
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
      {newsItems.map(({ identifier, createTime, headline, content }, index) => (
        <NewsItem
          identifier={identifier}
          createTime={moment(createTime)}
          headline={headline}
          isLastItem={index === newsItems.length - 1}
          content={content}
          previewOnly
        />
      ))}
    </Layout>
  );
};

export default NewsPage;
