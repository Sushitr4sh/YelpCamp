const express = require("express");
const port = 3000;
const app = express();

const session = require("express-session");

/* A single use of this line will automatically store a session id cookie (connect.sid) inside of your browser */
app.use(session({ secret: "thisisnotagoodsecret" }));

app.get("/viewcount", (req, res) => {
  /* If you are using session the req object will automatically have a session property that you can access and add a bunch of thing to it */
  /* We can add anything we want to req.session and that data in session is stored server side and it's associated with individual users/browsers */
  if (req.session.count) {
    req.session.count += 1;
  } else {
    req.session.count = 1;
  }

  res.send(`You have viewed this page ${req.session.count} times`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
