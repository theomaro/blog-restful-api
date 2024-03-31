const errorHandler = (error, req, res, next) => {
  let message = error.message;
  return res.status(409).json({
    success: false,
    message,
  });
};

const validationErrorHandler = (error, req, res, next) => {
  if (error.name === "ValidationError") {
    let message = error.details[0].message;
    message = message.includes("[ref:") ? "Password does not match" : message;

    return res.status(409).json({
      success: false,
      type: error.name,
      message,
    });
  } else next(error);
};

export { errorHandler, validationErrorHandler };
