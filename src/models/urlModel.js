import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true,
  },

  shortUrl: {
    type: String,
    required: true,
  },

  count: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


export const Url = mongoose.model('UrlSchema', urlSchema);

