const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");

const User = require("./models/user");

const session = require("express-session");

const bcrypt = require("bcrypt");

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "thisisnotagoodsecret",
    resave: false,
    saveUninitialized: true,
  })
);

const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/register");
  console.log("Database Connected");
}

app.get("/", (req, res) => {
  res.send("This is the home page!");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  /* const hashPw = await bcrypt.hash(password, 12); */
  const user = new User({
    username,
    password,
  });
  await user.save();
  req.session.user_id = user._id;
  res.redirect("/secret");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  /* const user = await User.findOne({ username: username });
  const validUser = await bcrypt.compare(password, user.password); */
  /* Shorter version */
  const foundUser = await User.findAndValidate(username, password);
  if (foundUser) {
    /* Remember that really all that there is to verify or proving someone is logged in currently is that their ID is stored in the session unser user_id, and you might think that it maybe really easy to fake, can't i just send a user id and a cookie or something? but remember the way that session works is that it's all stored server side and there's a signed cookie that is sent back to the client and that signed cookie is not going to be validated, if you tweak it or if you send your own version of it */
    req.session.user_id = foundUser._id;
    res.redirect("/secret");
  } else {
    res.redirect("/login");
  }
});

app.post("/logout", (req, res) => {
  /* req.session.user_id = null; or you can use: */
  req.session.destroy();
  /* This will set all the properties of session to be null, just not the user_id in case you store more than 1 in that session */
  res.redirect("/login");
});

app.get("/secret", requireLogin, (req, res) => {
  res.render("secret");
  console.log(req.session.user_id);
});

app.get("/topsecret", requireLogin, (req, res) => {
  res.send("KONTOLODONG");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
