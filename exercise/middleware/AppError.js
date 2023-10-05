class AppError extends Error {
  constructor(message, status) {
    super();
    /* Just by making an AppError class that has status on it, res.statusCode is set from err.status (or err.statusCode). If this value is outside the 4xx or 5xx range, it will be set to 500. */
    /* So you don't need to specify res.status anymore */
    this.message = message;
    this.status = status;
    /* Most error messages like the default error in javascript, that default object is not going to have a status just built in, that's why we make our own */
  }
}

module.exports = AppError;
