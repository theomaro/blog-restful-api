const errorHandler = (error, req, res, next) => {
  let message = error.message;
  let success = false;

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success,
      errorCode: error.errorCode,
      message,
    });
  }

  return res.status(500).json({
    success,
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

export default class AppError extends Error {
  constructor(errorCode, message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export { errorHandler, validationErrorHandler };
