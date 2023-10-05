const express = require("express");
const { route } = require("./shelterRoute");
const adminRouter = express.Router();

adminRouter.use((req, res, next) => {
  if (req.query.isAdmin) {
    next();
  } else {
    res.send("Sorry You're not an admin");
  }
});

adminRouter.get("/topsecret", (req, res) => {
  res.send("My biggest secret is: ");
});
adminRouter.get("/deleteme", (req, res) => {
  res.send("Deleting all");
});

module.exports = adminRouter;
