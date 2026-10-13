class ErrorHandler extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  err.message =
    err.message || "Internal Server Error";

  err.statusCode =
    err.statusCode || 500;

  // MongoDB duplicate key
  if (err.code === 11000) {
    err.message =
      "Duplicate value entered. This record already exists.";
    err.statusCode = 400;
  }

  // Mongoose validation
  if (err.name === "ValidationError") {
    err.message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");

    err.statusCode = 400;
  }

  // Invalid ObjectId
  if (err.name === "CastError") {
    err.message = "Invalid resource ID.";
    err.statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    err.message = "Invalid authentication token.";
    err.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    err.message = "Authentication token has expired.";
    err.statusCode = 401;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;