import AppError from "../middlewares/errors.middleware.js";
import User from "../models/users.model.js";

const user = User.getInstance();

export const getUsers = async (req, res) => {
  const [users, _] = await user.getUsers();
  if (users.length === 0)
    throw new AppError("UserNotFound", `${users.length} users found`, 404);

  return res.status(200).json({
    success: true,
    message: `${users.length} users retrieved`,
    totalCounts: users.length,
    users,
  });
};
