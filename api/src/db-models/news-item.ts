import { Document, model, Schema } from "mongoose";

export interface INewsItem extends Document {
  identifier: string;
  createTime: Date;
  headline: string;
  content: string;
  emailContent: string;
  isPublished: boolean;
}

const newsItemSchema = new Schema({
  identifier: String,
  createTime: Date,
  headline: String,
  content: String,
  emailContent: String,
  isPublished: Boolean,
});

export const NewsItem = model<INewsItem>("newsitem", newsItemSchema);
