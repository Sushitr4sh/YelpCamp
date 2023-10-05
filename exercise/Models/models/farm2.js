const mongoose = require("mongoose");
const { Schema } = mongoose;
const Product = require("./product");

const farmSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
  },
  city: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

/* When we set up our middleware and it's a query middleware which our has to be (findOneAndDelete), we need to wait until after our query has completed so that we have access to the document that was found! */
/* Remember that even though we use findByIdAndDelete, it will still trigger the findOneAndDelete middleware! */
farmSchema.pre("findOneAndDelete", async function (data) {
  /* Inside of the pre middleware we don't have access to the farm that is being deleted, which makes sense it's running before the query. In the post middleware however we have access to that data */
  console.log(`IN PRE MIDDLEWARE, data: ${data}`);
});
farmSchema.post("findOneAndDelete", async function (farm) {
  /* Check if products in not and empty array */
  if (farm.products.length) {
    const res = await Product.deleteMany({ _id: { $in: farm.products } });
    console.log(res);
  }
});

const farm = mongoose.model("Farm", farmSchema);

module.exports = farm;
