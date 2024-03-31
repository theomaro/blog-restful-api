const errorHandler = (error, req, res, next) => {
  let message = error.message;
  return res.status(409).json({
    success: false,
    message,
  });
};

const validationErrorHandler = (error, req, res, next) => {
  let message = error.message;
  message = message.includes("[ref:") ? "Password does not match" : message;

  return res.status(409).json({
    success: false,
    type: "validationError",
    message,
  });
};

export { errorHandler, validationErrorHandler };
