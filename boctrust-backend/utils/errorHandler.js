const errorHandlerMiddleware = (error, statusCode, res) => {
  const defaultError = {
    statusCode: statusCode || 500,
    msg: error?.message || "Something went wrong, try again later",
  };

  if (error.name === "ValidationError") {
    defaultError.statusCode = 400;
    // defaultError.msg = error.message
    defaultError.msg = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (error.code && error.code === 11000) {
    defaultError.statusCode = 400;
    defaultError.msg = `${Object.keys(error.keyValue)} field must be unique`;
  }

  res.status(defaultError.statusCode).json({ error: defaultError.msg });
};

module.exports = errorHandlerMiddleware;
