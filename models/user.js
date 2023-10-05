const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  /* See that we only specify email in here, the username and password field will be available on passport */
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
  },
});

/* Pass in the result of requiring that package that we installed to userSchema plugin, and this is going to add on our schema a username, password, salt, and hash field, make sure the username are unique and not duplicated, also gives us some additional static methods that we can use (register, serializeUser, diserializeUser, etc) */
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
