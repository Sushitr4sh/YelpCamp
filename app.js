/* process.env.NODE_ENV is and environment variable that is usually just development or production, we've been running in development this whole time, but eventually when we deploy, we will be running our code in production. Here we're saying if we are running in development mode, then require the dotenv package which is going to take the variables we've defined in .env file and then add it to process.env in our node app */
/* In production we don't actually do that, there's another way of setting environment variables where we don't store them in a file */
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

/* Express */
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

/* Mongoose */
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");

/* Models */
const Campground = require("./models/campground"); /* Mongoose Schema */
const Review = require("./models/review");
const User = require("./models/user");

/* Ejs */
const ejsMate = require("ejs-mate");

/* Error Handling */
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");

/* Cookies, Session, and Flash */
const session = require("express-session");
const flash = require("connect-flash");

/* Connect Mongo */
const MongoStore = require("connect-mongo");

/* Passport */
const passport = require("passport");
const LocalStrategy = require("passport-local");

/* Routers */
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

/* NoSQL Injection */
const mongoSanitize = require("express-mongo-sanitize");

/* Helmet */
const helmet = require("helmet");

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";
/* "mongodb://127.0.0.1:27017/yelp-camp" */
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
  console.log("Database Connected");
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
/* app.use(mongoSanitize()); */

const secret = process.env.SECRET || "squirrel";
const store = MongoStore.create({
  mongoUrl: dbUrl,
  /* If you are using express-session >= 1.10.0 and don't want to resave all the session on database every single time that the user refreshes the page, you can lazy update the session, by limiting a period of time. */
  /* by doing this, setting touchAfter: 24 * 3600 you are saying to the session be updated only one time in a period of 24 hours, does not matter how many request's are made (with the exception of those that change something on the session data) */
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});
store.on("error", function (e) {
  console.log(e);
});

app.use(
  session({
    store,
    name: "session",
    secret,
    resave: false, //don't save session if unmodified
    saveUninitialized: true, // don't create session until something stored
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      /* This basically says that our cookies, at least the one that are set through the session are only accessible via HTTP, they're not accessible through javascript. So if somebody were to write a javascript that executes on our side and extract cookies, they will not be able to see our session cookies */
      httpOnly: true,
      /* This says that, this cookie only work over HTTPS(HTTP secure). The cookies can only be configured over secure connections */
      /* secure: true, */
    },
  }),
);
app.use(flash());

/* This automatically enables all 11 of the helmet middleware that helmet comes with */
/* app.use(helmet()); */
const scriptSrcUrls = [
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://cdnjs.cloudflare.com/",
  "https://kit.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://fonts.googleapis.com/",
  "https://cdn.tailwindcss.com",
  "https://unpkg.com/",
];
const styleSrcUrls = [
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://kit-free.fontawesome.com/",
  "https://use.fontawesome.com/",
  "https://cdn.tailwindcss.com",
  "https://unpkg.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = ["https://fonts.googleapis.com/"];

/* app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dysmngiix/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
    },
  }),
); */

/* Make sure that session is used before passport.session */
app.use(passport.initialize());
app.use(passport.session());
/* What we're doing here is, tell passport we're going to use the LocalStrategy  (cause there's many strategies you can choose) that we've downloaded and required, and for that local strategy, the authentication method is going to be located on our user model and it's called authenticate(). */
passport.use(new LocalStrategy(User.authenticate()));
/* This is going to tell passport how to serialize a user, and serialization refers to basically how do we get data or how do we store user in that session */
passport.serializeUser(User.serializeUser());
/* How do you get a user out of that session */
passport.deserializeUser(User.deserializeUser());
/* These methods have been added in thanks to the userSchema.plugin(passportLocalMongoose) */
/* So whatever strategy we're using in this case the local strategy, we can have multiple strategies going at once, we also need to specify the User.authenticate() method which is also added for us automatically */

/* Also remember to put this after you initialize passport, or else your req.user field will not be defined even if you're logged in */
/* In Express.js, res.locals is an object that provides a way to pass data through the application during the request-response cycle. It allows you to store variables that can be accessed by your templates and other middleware functions. */
app.use((req, res, next) => {
  /* We don't have to pass anything to our templates, we just have access to success */
  /* console.log(req.session); */
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/fakeUser", async (req, res) => {
  /* makes a new instance of our user model, but not specifying the password field */
  const user = new User({
    email: "mariodaruranto68@gmail.com",
    username: "mariodrt68",
  });
  /* register method is provided as a helper thx to our passportLocalMongoose plugin, where this is a convenience method to register a new user instance with a given password, also it checks if the username is unique. */
  const newUser = await User.register(user, "sauce?");
  /* User.register takes the entire user model, the instance of the user model, and then a password, and it's going to hash that password, takes the salt, store the salt and the hashed salt */
  res.send(newUser);
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found!", 404));
});

app.use((err, req, res, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(err.statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
