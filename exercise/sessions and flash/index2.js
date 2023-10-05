const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");

const session = require("express-session");
const flash = require("connect-flash");

const Farm = require("./models/farm2");
const Product = require("./models/product");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "thisisnotagoodsecret",
    resave: false,
    saveUninitialized: false,
  })
);
/* Now, any route handler or middleware, the request object will have a method called flash */
app.use(flash());

/* Set all the flash message in a locals so that we'll have access to them in any template that is rendered  under the key of messages */
app.use((req, res, next) => {
  res.locals.messages = req.flash("success");
  next();
});

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/farmStand2");
}

const categories = ["fruit", "vegetable", "dairy"];

/* Farm Route */
app.get("/farms", async (req, res) => {
  const farms = await Farm.find({});
  res.render("farms/index", { farms });
});

app.get("/farms/new", (req, res) => {
  res.render("farms/new");
});

app.get("/farms/:id", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id).populate("products");
  res.render("farms/show", { farm });
});

app.post("/farms", async (req, res) => {
  const farm = new Farm(req.body);
  await farm.save();
  /* This is an example for flash method on request object */
  req.flash("success", "Successfully made a new farm!");
  res.redirect("farms");
});

app.get("/farms/:id/edit", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  res.render("farms/edit", { farm });
});

app.put("/farms/:id", async (req, res) => {
  const { id } = req.params;
  await Farm.findByIdAndUpdate(id, req.body);
  res.redirect(`/farms/${id}`);
});

app.get("/farms/:id/products/new", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  res.render("products/new", { categories, farm });
});

app.post("/farms/:id/products", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  const product = new Product(req.body);
  farm.products.push(product);
  product.farm = farm;
  await farm.save();
  await product.save();
  res.redirect(`/farms/${id}`);
});

app.delete("/farms/:id", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findByIdAndDelete(id);
  res.redirect("/farms");
});

/* Product Route */
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
  res.render("products/new", { categories });
});

app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.redirect(`/products/${newProduct._id}`);
});

/* show product */
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("farm", "name");
  res.render("products/show", { product });
});

/* edit product */
app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product, categories });
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.redirect(`/products/${product._id}`);
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.redirect("/products");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
