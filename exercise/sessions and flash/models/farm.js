const mongoose = require("mongoose");
const { Schema } = mongoose;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/farmStand2");
  console.log("Database Connected");
}

const productSchema = new Schema({
  name: String,
  price: String,
  season: {
    type: String,
    enum: ["Spring", "Summer", "Fall", "Winter"],
  },
});

const farmSchema = new Schema({
  name: String,
  city: String,
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Product = mongoose.model("Product", productSchema);
const Farm = mongoose.model("Farm", farmSchema);

const makeFarm = async () => {
  const farm = new Farm({ name: "Swelohovo Farm", city: "Bojolali" });
  const apple = await Product.findOne({ name: "Apple" });
  farm.products.push(apple);
  /* When you're console.logging the farm with types of objectId it will print all the property of the document, but when you save it, it will only save the id */
  await farm.save();
  console.log(farm);
};

/* makeFarm(); */

const addProduct = async () => {
  const farm = await Farm.findOne({ name: "Swelohovo Farm" });
  const carrot = await Product.findOne({ name: "Carrot" });
  farm.products.push(carrot);
  farm.save();
  console.log(farm);
};

/* addProduct(); */

/* Product.insertMany([
  {
    name: "Apple",
    price: 1.0,
    season: "Fall",
  },
  {
    name: "Strawberry",
    price: 2.5,
    season: "Summer",
  },
  {
    name: "Carrot",
    price: 0.5,
    season: "Winter",
  },
  {
    name: "Watermelon",
    price: 3.0,
    season: "Summer",
  },
]); */

Farm.findOne({ name: "Swelohovo Farm" })
  .populate("products")
  .then((res) => console.log(res));
