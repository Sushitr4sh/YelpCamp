const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username cannot be blank!"],
  },
  password: {
    type: String,
    required: [true, "Password cannot be blank!"],
  },
});

/* statics is where we can define multiple methods that will be added to the user class itself, and not to particular or individual instances of user */
/* And remember not to use arrow function because this in arrow function behave differently than this in normal function */
userSchema.statics.findAndValidate = async function (username, password) {
  const foundUser = await this.findOne({ username });
  const isValid = await bcrypt.compare(password, foundUser.password);
  return isValid ? foundUser : false;
};

userSchema.pre("save", async function (next) {
  /* In this case, "this" refers to individual user instance and not the user schema it self */
  /* If we were to change a username and save without the password being changed, we don't want to rehash the password, it's just unnecessary, we only want to rehash the password if the password has been modified and there is a particular method: */
  if (!this.isModified("password")) {
    return next();
    /* which just mean go on to calling save, skip the code below, but if password has been modified, we're going to hash it with bcrypt */
  }
  /* isModified tells us true or false if password has been modified ono this one particular instance of user */
  /*  */
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
