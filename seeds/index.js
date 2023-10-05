const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelper");
const Campground = require("../models/campground");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
  console.log("Seed Database Connected");
}

/* Function to random the campground title on seedHelper.js */
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async function () {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 1;
    const campground = new Campground({
      author: "65045dcb9e065faf32f6ddc5",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dysmngiix/image/upload/v1695823743/YelpCamp/sy3yrbi8ibqmp5uq0yhq.jpg",
          filename: "YelpCamp/sy3yrbi8ibqmp5uq0yhq",
        },
        {
          url: "https://res.cloudinary.com/dysmngiix/image/upload/v1695823743/YelpCamp/phrhqzt5xw44ucfhwc1v.jpg",
          filename: "YelpCamp/phrhqzt5xw44ucfhwc1v",
        },
        {
          url: "https://res.cloudinary.com/dysmngiix/image/upload/v1695823743/YelpCamp/vbout1idep5s2thy7jh6.jpg",
          filename: "YelpCamp/vbout1idep5s2thy7jh6",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem ratione, sunt accusamus voluptate laborum cupiditate sit sapiente nobis dolorem iste.",
      price: price,
    });
    await campground.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
