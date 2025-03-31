const logger = require("../utils/logger");

/**
 * Custom error handler middleware
 * Logs errors and sends appropriate responses
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 server error
  let error = { ...err };
  error.message = err.message;
  error.status = err.status || 500;

  // Log the error details
  const logObject = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    statusCode: error.status,
    errorMessage: error.message,
  };

  // Log stack trace for development environment
  if (process.env.NODE_ENV === "development") {
    logObject.stack = err.stack;
  }

  // Log different levels based on error severity
  if (error.status >= 500) {
    logger.error(`Server Error: ${JSON.stringify(logObject)}`);
  } else if (error.status >= 400) {
    logger.warn(`Client Error: ${JSON.stringify(logObject)}`);
  } else {
    logger.info(`Info: ${JSON.stringify(logObject)}`);
  }

  // Customize error responses based on type
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error.message = messages.join(", ");
    error.status = 400;
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    error.message = "Duplicate field value entered";
    error.status = 400;
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error.message = `Resource not found with id of ${err.value}`;
    error.status = 404;
  }

  // JSON parsing error
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    error.message = "Invalid JSON payload";
    error.status = 400;
  }

  // Send response
  res.status(error.status).json({
    success: false,
    error:
      process.env.NODE_ENV === "production" && error.status >= 500
        ? "Server Error"
        : error.message,
  });
};

module.exports = errorHandler;
