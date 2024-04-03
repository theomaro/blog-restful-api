import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response
) => {
  let message = error.message;
  let success = false;

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success,
      errorCode: error.errorCode,
      message: error.message,
    });
  }

  return res.status(500).json({
    success,
    message,
  });
};

export const tokenErrorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.name === "TokenExpiredError") {
    let message = error.message;

    return res.status(409).json({
      success: false,
      type: error.name,
      message,
    });
  }

  next(error);
};

export const validationErrorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.name === "ValidationError") {
    // TODO let message = error.details[0].message;
    let message = error.message;
    message = message.includes("[ref:") ? "Password does not match" : message;

    return res.status(409).json({
      success: false,
      type: error.name,
      message,
    });
  }

  next(error);
};

export default class AppError extends Error {
  statusCode: number;
  errorCode: any;

  constructor(errorCode: string, message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}
