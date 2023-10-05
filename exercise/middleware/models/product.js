const mongoose = require("mongoose");
/* We don't need to connect to the database here, because we will then import the model to index.js */

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name Cannot be blank!"],
  },
  price: {
    type: Number,
    min: 0,
    required: [true, "Price cannot be blank also!"],
  },
  category: {
    type: String,
    lowercase: [true, "category must be lowercased!"],
    enum: ["fruit", "vegetable", "dairy"],
  },
});

const Product = new mongoose.model("Product", productSchema);

module.exports = Product;
