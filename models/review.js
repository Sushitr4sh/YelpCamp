const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./user");

const reviewSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
