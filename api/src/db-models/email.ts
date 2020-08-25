import { Document, model, Schema } from "mongoose";

export interface IEmail extends Document {
  messageId: string;
  sendTime: Date;
}

const emailSchema = new Schema(
  {
    messageId: String,
    sendTime: Date,
  },
  { timestamps: true },
);

export const Email = model<IEmail>("email", emailSchema);
