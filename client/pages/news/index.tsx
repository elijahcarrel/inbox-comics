import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import moment from "moment";
import React, { useState } from "react";
import { Layout } from "../../common-components/Layout/Layout";
import { Paginate } from "../../common-components/Paginate/Paginate";
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
const numNewsItemsPerPage = 5;

const NewsPage: React.FunctionComponent = () => {
  const [pageNumber, setPageNumber] = useState(0);

  const newsQueryResponse = useQuery<NewsItemResponse>(newsQuery);
  const { data, error, loading } = newsQueryResponse;
  if (error) {
    return <Layout title={title} error={stringifyGraphQlError(error)} />;
  }

  if (loading || !data || !data.getNews) {
    return <Layout title={title} isLoading />;
  }
  const { getNews: newsItems } = data;
  const offset = pageNumber * numNewsItemsPerPage;
  const numPages = Math.ceil(newsItems.length / numNewsItemsPerPage);
  const visibleNewsItems = newsItems.slice(offset, offset + numNewsItemsPerPage);

  return (
    <Layout title={title}>
      {visibleNewsItems.map(({ identifier, createTime, headline, content }, index) => (
        <NewsItem
          identifier={identifier}
          createTime={moment(createTime)}
          headline={headline}
          isLastItem={index === visibleNewsItems.length - 1}
          content={content}
          previewOnly
        />
      ))}
      <Paginate
        numPages={numPages}
        onPageChange={setPageNumber}
      />
    </Layout>
  );
};

export default NewsPage;
