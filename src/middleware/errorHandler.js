const notFound = (req, res) => {
  res.status(404).json({ msg: "route doesn't exist!" });
};

const errorHandler = (err, req, res, next) => {
  const customError = {
    errorMessage: err.message || "something went wrong!",
    errorCode: res.statusCode || 500,
  };

  if (err.name === "ValidationError") {
    customError.errorMessage = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    customError.errorCode = 400;
  }

  if (err.name === "ECONNRESET") {
    customError.errorMessage = "caught";
    customError.errorCode = 500;
  }

  if (err.code || err.code === 11000) {
    customError.errorMessage = `resource already exists!`;
    customError.errorCode = 400;
  }

  return res
    .status(customError.errorCode)
    .json({ msg: customError.errorMessage });
};

module.exports = { errorHandler, notFound };
