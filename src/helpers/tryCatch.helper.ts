import { NextFunction, Request, Response, RequestHandler } from "express";

const tryCatch =
  (controller: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      return next(error);
    }
  };

export default tryCatch;
