import { NextFunction, Request, Response } from "express";

const tryCatch =
  (controller: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error: any) {
      let message = error.message;
      let success = false;

      return res.status(500).json({
        success,
        message,
      });
    }
  };

export default tryCatch;
