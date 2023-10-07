const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");

/* https://res.cloudinary.com/dysmngiix/image/upload/w_200/v1695823743/YelpCamp/sy3yrbi8ibqmp5uq0yhq.jpg */

/* This just saying that every image has a URL that's a string and a filename that's a string. And now images on the campgroundSchema should be array of ImageSchema. All we do really is move things out, because when we want to usu a virtual, it will only works for a Schema. */

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

/* Now we can do this: */
ImageSchema.virtual("thumbnail").get(function () {
  /* this refers to particular image of ImageSchema in images array */
  return this.url.replace("/upload", "/upload/w_300");
});

const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema(
  {
    title: String,
    location: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    description: String,
    price: Number,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts,
);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <a href="/campgrounds/${this._id}" class="text-lg text-blue-600 underline mt-2">${this.title}</a>
  <p class="font-thin">${this.location}</p>`;
});
campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
