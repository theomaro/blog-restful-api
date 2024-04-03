import { Request, RequestHandler, Response } from "express";
import AppError from "../middlewares/errors.middleware.js";
import User from "../models/users.model.js";

const user = User.getInstance();

export const getUsers: RequestHandler = async (req: Request, res: Response) => {
  const limit = req.query.limit ?? "10";
  const offset = req.query.page ?? "1";

  let users = await user.getUsers(
    req.body.id,
    Number(limit),
    Number(offset) - 1
  );
  if (users.length === 0)
    throw new AppError("UserNotFound", `${users.length} users found`, 404);

  return res.status(200).json({
    success: true,
    message: `${users.length} users retrieved`,
    totalCounts: users.length,
    users,
  });
};

export const getUser: RequestHandler = async (req: Request, res: Response) => {
  const userData = await user.getUser(req.params.username);

  if (!userData)
    throw new AppError("UserNotFound", `no user have been found`, 404);

  return res.status(200).json({
    success: true,
    message: `user data retrieved`,
    user: userData,
  });
};
