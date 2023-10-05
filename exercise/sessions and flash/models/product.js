const mongoose = require("mongoose");
const { Schema } = mongoose;
/* We don't need to connect to the database here, because we will then import the model to index.js */

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  category: {
    type: String,
    lowercase: [true, "category must be lowercased!"],
    enum: ["fruit", "vegetable", "dairy"],
  },
  farm: {
    type: Schema.Types.ObjectId,
    ref: "Farm",
  },
});

const Product = new mongoose.model("Product", productSchema);

module.exports = Product;
