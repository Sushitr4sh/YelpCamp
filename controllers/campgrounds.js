const Campground = require("../models/campground"); /* Mongoose Schema */
const moment = require("moment");
const { cloudinary } = require("../cloudinary");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", {
    campgrounds,
  });
};

module.exports.searchCampgrounds = async (req, res) => {
  const { q } = req.query;
  const campgrounds = await Campground.find({
    title: { $regex: q, $options: "i" },
  });
  res.render("campgrounds/search", { campgrounds, q });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  /* if (!req.body.campground)
    throw new ExpressError("Invalid Campground Data!", 400); */
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  /* Remember that req.user is automatically added by passport to check whether there's a user currently logged in or not */
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  console.log(req.files);
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      /* Populate author that are referenced for specific review */
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    /* We need to return here so that we don't render the show page, or else we can use the else operator */
    return res.redirect("/campgrounds");
  }
  campground.reviews.forEach((review) => {
    const createdAt = moment(review.createdAt);
    const currentTime = moment();
    review.relativeTime = createdAt.from(currentTime);
  });
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find and edit that campground!");
    /* We need to return here so that we don't render the show page, or else we can use the else operator */
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  /* Now we can't just use finByIdAndUpdate and update all, we need to divide it into two steps. It's no longer good enough to just find and update all at once, we want to find first and then check to see if we can update, meaning if the author of that campground that we found matches the currently logged in user that are sending this request */
  const campground = await Campground.findByIdAndUpdate(id, {
    $set: { ...req.body.campground },
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }

  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a campground");
  res.redirect("/campgrounds");
};
