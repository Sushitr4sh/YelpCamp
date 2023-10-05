/* An express middleware are functions that run during the request/response lifecycle */
/* Request -> Middleware -> Response */

/* 
    -Middleware are just functions
    -Each middleware has access to the request and response objects (they can make changes to it like parsing the body, parsing the req.body and json data with express builtin middleware)
    -Middleware can end the HTTP request by sending back a response with method like res.send()
    -OR middleware can be chained together, one after another by calling next()
*/
const express = require("express");
const app = express();
const port = 3000;

const morgan = require("morgan");
const AppError = require("./AppError");

/* We've injected this little thing in the middle that is just logging every single request, and we could do that ourself except that we haven't yet seen how to tell express to move to the next middleware. Because what morgan does is it runs and then it tells, okay move on to whatever comes next and it might be the route to / or /dogs or etc */

app.use((req, res, next) => {
  req.requestTime = Date.now();
  console.log("inside the middleware!");
  console.log(req.method, req.path);
  next();
});

const verifyPassword = (req, res, next) => {
  const { password } = req.query;
  if (password === "chickennugget") {
    next();
  }
  /* res.send("Sorry You're not authenticated"); */
  /* We can also throw an error instead of sending back something to the user explicitly */
  throw new AppError("You need a password you dumbass!", 402);
  /* Whether we throw the error ourself or some code generates an error, they're treated the same way in express'es eye (whether the error is encountered in one of our middleware, route callback/handler) */
  /* The default error handler in express, is looking for error.status, so we put it in there and it's going to use that! */
};

/* app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log(`This is the first middleware!`);
  return next();
  console.log(`This is the first middleware after calling next!`);
});
app.use((req, res, next) => {
  console.log(`This is the second middleware!`);
  next();
});
app.use((req, res, next) => {
  console.log(`This is the third middleware!`);
  next();
}); */

app.get("/", (req, res) => {
  console.log(`REQUEST TIME: ${req.requestTime}`);
  res.send("Home Page");
});

app.get("/error", (req, res) => {
  /* This is an example of express built-in error handler. Where it will send an html page with the error and also print the stack trace and status code our terminal. Note that the express error handler is a middleware which will be executed if an error occur on the last stack of the middleware*/
  chicken.fly();
});

app.get("/dogs", (req, res) => {
  console.log(req.requestTime);
  res.send("WOOF WOOF");
});

app.get("/secret", verifyPassword, (req, res) => {
  res.send("My biggest secret is something");
});

app.get("/admin", (req, res) => {
  throw new AppError("You Are Not An Admin!", 403);
});

app.use((req, res) => {
  res.status(404).send("PAGE NOT FOUND!");
});

/* Define error-handling middleware functions in the same way as other middleware functions, except error-handling functions have four arguments instead of three: (err, req, res, next). For example: */
/* You define error-handling middleware last, after other app.use() and routes calls; for example: */
app.use((err, req, res, next) => {
  /* console.log("*******************");
  console.log("*******ERROR*******");
  console.log("*******************"); */
  /* Every error that occur whether you're the one who threw it or syntax error or etc will be passed on the error argument on the callback above! */
  /* console.log(err); */
  /* This next is to call the next middleware but remember if you pass an argument to the next, it will be the next error handling middleware and not a route handler! */
  /* next(err); */

  /* WE can also deconstruct the status from the err, but remember that status only exist in AppError and not the default Error object so when you access something that didn't exist in the default Error object it will give you an undefined error */
  console.dir(err);
  const { status = 500, message = "Something Went Wrong!" } = err;
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
