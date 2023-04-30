import { NewsItem } from "../db-models/news-item";
import { invalidNewsItemError } from "../util/error";

export const getNews = async () => {
  return NewsItem.find({ isPublished: true }).sort({ createTime: -1 }).exec();
};

export const getNewsItem = async (_: any, args: { identifier: string }) => {
  const { identifier } = args;
  const newsItem = await NewsItem.findOne({ identifier }).exec();
  if (newsItem == null) {
    throw invalidNewsItemError(identifier);
  }
  return newsItem;
};
