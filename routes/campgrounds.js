const express = require("express");
const router = express.Router();

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

/* Mongoose Schema */
const Campground = require("../models/campground");

/* Controller */
const campgrounds = require("../controllers/campgrounds");

/* Middleware */
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

/* We don't need to specify the index file in cloudinary because node automatically looks for index file */
const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.get("/search", campgrounds.searchCampgrounds);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
