const mongoose = require("mongoose");
const { Schema } = mongoose;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/farmStand2");
  console.log("Database Connected");
}

const userSchema = new Schema({
  username: String,
  age: Number,
});

const tweetSchema = new Schema({
  text: String,
  likes: Number,
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const User = mongoose.model("User", userSchema);
const Tweet = mongoose.model("Tweet", tweetSchema);

const makeTweets = async () => {
  /* const user = new User({ username: "thotslayer___", age: 19 }); */
  const user = await User.findOne({ username: "thotslayer___" });
  const tweet2 = new Tweet({
    text: "this edible ain't shit",
    likes: 1134,
  });
  /* This is just saving the user id and not whole user */
  tweet2.user = user;
  /* user.save(); */
  tweet2.save();
};

/* makeTweets(); */

const findTweet = async () => {
  /* Populate only username on user */
  const t = await Tweet.find({}).populate("user", "username");
  console.log(t);
};

findTweet();
