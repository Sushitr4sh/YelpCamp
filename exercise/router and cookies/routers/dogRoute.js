const express = require("express");
const dogRouter = express.Router();

dogRouter.get("/", (req, res) => {
  res.send("Viewing list of dogs");
});
dogRouter.get("/:id", (req, res) => {
  res.send("Viewing a dog");
});
dogRouter.get("/:id/edit", (req, res) => {
  res.send("Editing a dog");
});

module.exports = dogRouter;
