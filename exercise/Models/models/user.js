const mongoose = require("mongoose");

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/relationalDB");
  console.log("database connected!");
}

const userSchema = new mongoose.Schema({
  first: String,
  last: String,
  addresses: [
    /* Remember that every time you make a document, mongo will automatically make an id for it, so if you don't need it, you can disable it by setting the _id property to false */
    /* This is an example of one to few relation which is actually one to many relationship in a database, but since it won't be more than 10 if you have an address, we can just keep it on the same document! */
    {
      _id: { _id: false },
      street: String,
      city: String,
      state: String,
      nation: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

const makeUser = async () => {
  const person = new User({
    first: "Mario",
    last: "Imanuel",
  });
  person.addresses.push({
    street: "Ade Irma",
    city: "Kupang",
    state: "Nusa Tenggara Timur",
    nation: "Indonesia",
  });
  const res = await person.save();
  console.log(res);
};

/* makeUser(); */

const addAddress = async (id) => {
  const user = await User.findById(id);
  user.addresses.push({
    street: "BTN",
    city: "Soe",
    state: "Nusa Tenggara Timur",
    nation: "Indonesia",
  });
  const res = await user.save();
  /* console.log(res); */
};

addAddress("64d342e83dacacd2fd4ec1f6");
