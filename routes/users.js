const express = require("express");
const router = express.Router();

const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

/* Controller */
const users = require("../controllers/users");

/* Middleware */
const { storeReturnTo } = require("../middleware");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    catchAsync(users.login)
  );

/*  in the latest versions of Passport.js, the req.logout() method now requires a callback function passed as an argument. Inside this callback function, we will handle any potential errors and also execute the code to set a flash message and redirect the user. */
router.get("/logout", users.logout);

module.exports = router;
