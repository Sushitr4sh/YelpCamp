const express = require("express");
const shelterRouter = express.Router();

shelterRouter.get("/", (req, res) => {
  res.send("Viewing shelter list");
});
shelterRouter.get("/:id", (req, res) => {
  res.send("Viewing a shelter");
});
shelterRouter.get("/:id/edit", (req, res) => {
  res.send("Editing a shelter");
});

module.exports = shelterRouter;
