const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    /* This helps user to be logged in after register. Down there when we login we use passport.authenticate instead => we can't authenticate someone until we've created a user */
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      else {
        req.flash("success", "Successfully registered as a user!");
        res.redirect("/campgrounds");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

/* passport gives us a middleware we can use called passport.authenticate(), and it's going to expect us to specify a strategy (in this case local). After that we have some options we can specify in an object (failureFlash: flash a message for us automatically, failureRedirect: if fail, redirect to some route)*/
module.exports.login =
  // Now we can use res.locals.returnTo to redirect the user after
  async (req, res) => {
    req.flash("success", "Welcome Back!");
    /* There is a chance that there's no a returnTo because a user could just click the login without ever being redirected to login */
    /* For example, if a users now on a show page of a campground, and then he clicks log-in, we want that users to redirected back to the show page of that campgrounds. If you're not specifying this, the isLoggedIn middleware will not be triggered and there is no req.session.returnTo, so we make an or statement so that the redirectUrl is not empty */
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  };

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "Goodbye!");
      res.redirect("/campgrounds");
    }
  });
};
