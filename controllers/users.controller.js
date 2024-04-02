import AppError from "../middlewares/errors.middleware.js";
import User from "../models/users.model.js";

const user = User.getInstance();

export const getUsers = async (req, res) => {
  const limit = parseInt(req.body.limit) ?? 10;
  const offset = parseInt(req.body.page) - 1 ?? 0;

  const [users, _] = await user.getUsers(req.body.id, limit, offset);

  if (users.length === 0)
    throw new AppError("UserNotFound", `${users.length} users found`, 404);

  return res.status(200).json({
    success: true,
    message: `${users.length} users retrieved`,
    totalCounts: users.length,
    users,
  });
};

export const getUser = async (req, res) => {
  const [userData, _] = await user.getUser(req.body.username);

  if (!userData[0])
    throw new AppError("UserNotFound", `no user have been found`, 404);

  return res.status(200).json({
    success: true,
    message: `user data retrieved`,
    user: userData[0],
  });
};
