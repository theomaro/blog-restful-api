import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let message = error.message;
  let success = false;

  console.log(1);

  return res.status(500).json({
    success,
    message,
  });
};
