const express = require("express");
/* This is to ensure that we have access to req.params on the app.js so we can find some id etc */
/* It's not a problem  for our other one for campgrounds because the ID that we need in our campground routes, it's all defined in campgrounds.js router, and we're simply prefixing with slash campgrounds*/
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");

/* Mongoose Schema */
const Campground = require("../models/campground");
const Review = require("../models/review");

/* Controller */
const reviews = require("../controllers/reviews");

/* Middleware */
const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
  isAuthor,
} = require("../middleware");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
