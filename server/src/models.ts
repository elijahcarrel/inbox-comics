import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: String,
  email: String
});

export const User = mongoose.model('user', userSchema);
