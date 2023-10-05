const bcrypt = require("bcrypt");

const hashPassword = async (pw) => {
  /* 10 is the salt round, or you can say the cost of processing the data. This operation takes time so you need to await it. */
  const salt = await bcrypt.genSalt(12);
  /* What kind of confusing is, we can set the round number to be whatever we want, and we're not going to notice the difference amount of time it takes to generate the salt. It's going to generate a salt, and the salt itself is going to dictate how many rounds bcrypt needs to go through, how many time it's going to hash when we actually hash it. */
  const hash = await bcrypt.hash(pw, salt);
  /* The salt is always changing because that's the main idea, and it will also produce different hash so thaht user with a same common password will get different hash */
  console.log(salt);
  console.log(hash);
};

const hashPassword2 = async (pw) => {
  const hash = await bcrypt.hash(pw, 12);
  console.log(hash);
};

const login = async (pw, hashedPw) => {
  const result = await bcrypt.compare(pw, hashedPw);
  if (result) {
    console.log("Logged you in successfully!");
  } else {
    console.log("INCORRECT PASSWORD!");
  }
};

/* hashPassword("monkey");
login("monkey", "$2b$12$.dBep6mjLF8FUVE/6uKaleD35dJ3Nl5Beg0uG.20WHNaJJ//yD5Ee"); */
/* You'll notice that the salt is included as part of the hash, this is kind of a quirk of bcrypt when you're starting out, it's hard to understand but the salt is here, and then when we go to verify or log someone in, bcrypt has a method called compare that will automatically take a hash, and in that hash you can figure out what the salt was (The beginning part), and then it can use that salt plus the password that we're tying to compare, and it will run it's hash and figure out if we get the same response, the same answer back. So we don't need to store the salt ourselves in a separate location, it's just part of the hash end result*/

/* hashPassword2("monyet"); */
login("monyet", "$2b$12$iegKz9BtEpHxAka0ekwiSu8Flw3zrsrIaNuBuKFfF7dQn7Di4zsFW");
