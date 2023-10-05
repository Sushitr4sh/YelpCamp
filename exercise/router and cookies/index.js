const express = require("express");
const cookieParser = require("cookie-parser");
/* const shelterRouter = require("./routers/shelterRoute");
const dogRouter = require("./routers/dogRoute");
const adminRouter = require("./routers/adminRoute"); */

const port = 3000;

const app = express();
app.use(cookieParser("thisismysecretsign"));

/* app.use("/shelters", shelterRouter);
app.use("/dogs", dogRouter);
app.use("/admin", adminRouter); */

app.get("/greet", (req, res) => {
  const { name = "No-name" } = req.cookies;
  res.send(`Hey there ${name}`);
});

app.get("/setname", (req, res) => {
  res.cookie("name", "Henrietta");
  res.cookie("animal", "harlequin shrimp");
  /* Don't forget to send because cookies is a part of send */
  res.send("COOKIE IS SET!");
});

app.get("/signedcookie", (req, res) => {
  res.cookie("fruit", "grape", { signed: true });
  res.send("OKAY SIGNED YOUR COOKIE");
});

app.get("/verifycookie", (req, res) => {
  console.log(req.cookies);
  console.log(req.signedCookies);
  res.send(req.signedCookies);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
