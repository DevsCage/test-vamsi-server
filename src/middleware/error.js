const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log(err);
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if ((process.env.NODE_ENV = "PRODUCTION")) {
    let error = { ...err };
    //Wrong ID error
    error.message = err.message;
    if (err.message === "CastError") {
      const message = "Resource not found" + err.path;
      error = new ErrorHandler(message, 404);
    }
    //Validaion error
    if (err.name === "ValidationError") {
      const message = Object.values(err.values).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }

    //Handling mongoose duplicate key error

    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      error = new ErrorHaandler(message, 400);
    }

    // handling wrng jwt error
    if (err.code === "JsonWebTokenError") {
      const message = "Json web token is invalid";
      error = new ErrorHaandler(message, 400);
    }

    //Handling expired JWT error

    if (err.name === "TokenExpiredError") {
      const message = "Json web token is expired";
      error = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
