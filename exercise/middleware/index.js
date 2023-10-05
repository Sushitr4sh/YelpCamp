const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");

const Product = require("./models/product");
const categories = ["fruit", "vegetable", "dairy"];

const AppError = require("./AppError");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/farmStand");
}

app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category: category });
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find();
    res.render("products/index", { products, category: "All" });
  }
});

/* THIS MUST COME BEFORE THE SHOW PAGE, or else it will though that the /new is the id! */
app.get("/products/new", (req, res) => {
  /* throw new AppError("NOT ALLOWED", 501); */
  res.render("products/new", { categories });
});

app.post("/products", async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
  } catch (e) {
    next(e);
  }
});

/* show product */
/* Instead of doing try and catch for every router that we have, we can make an async wrapper function that will take the async callback in the router and then run it, and catch the error if occur */
function asyncWrapper(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
}
app.get(
  "/products/:id",
  asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    /* For errors returned from asynchronous functions invoked by route handlers and middleware, you must pass them to the next() function, where Express will catch and process them. For example: */
    if (!product) {
      /* return next(new AppError("Cannot Find Product", 404)); */
      throw new AppError("Cannot Find Product", 404);
      /* Remember that if we pass nothing into next, it will look for the next middleware but if we pass anything inside of it, it will run any error handling middleware */

      /* NEXT DOESN'T necessarily just stop the execution of your code in this function, it will only call the next middleware, but the code below will still run  */
      /* You need to use the keyword return or 'else' so everything will be done! */
    }
    /* This won't get rendered because our error handler middleware is going to run first, but this res.render will still pass the product to show template and get an error message */
    res.render("products/show", { product });
  })
);

/* edit product */
app.get("/products/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      /* return next(new AppError("Cannot Find Product To Edit", 404)); */
      throw new AppError("Cannot Find Product To Edit", 404);
    }
    res.render("products/edit", { product, categories });
  } catch (e) {
    next(e);
  }
});

app.put("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.redirect(`/products/${product._id}`);
  } catch (e) {
    next(e);
  }
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.redirect("/products");
});

function handleValidationErr(err) {
  console.dir(err);
  return err;
}

app.use((err, req, res, next) => {
  console.log(`NOW ON our error handler middleware: ${err.name}`);
  if (err.name === "ValidationError") {
    err = handleValidationErr(err);
  }
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something Went Wrong" } = err;
  /* message = "gaboleh gtu tolol"; */
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
