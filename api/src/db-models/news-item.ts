import { Document, model, Schema } from "mongoose";

export interface INewsItem extends Document {
  identifier: string;
  createTime: Date;
  headline: string;
  content: string;
}

const newsItemSchema = new Schema({
  identifier: String,
  createTime: Date,
  headline: String,
  content: String,
});

export const NewsItem = model<INewsItem>("newsitem", newsItemSchema);
