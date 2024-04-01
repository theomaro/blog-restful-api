import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {
  login,
  passwords,
  profile,
  uname,
} from "../helpers/validator.helper.js";
import AppError from "../middlewares/errors.middleware.js";

const user = User.getInstance();

const getUser = async (req, res) => {
  const id = req.body.id;

  const [results, _] = await user.getUserById(id);
  if (results.length === 0)
    throw new AppError("UserNotFound", "User does not exist", 404);

  return res.status(200).json({
    success: true,
    message: "user data retrieved",
    user: results[0],
  });
};

const getUsers = async (req, res) => {
  const { limit, page } = req.body.filter;

  const [users, _] = await user.getUsers(req.body.id, limit, page);
  if (users.length === 0)
    throw new AppError("UserNotFound", `${users.length} users found`, 404);

  return res.status(200).json({
    success: true,
    message: `${users.length} users retrieved`,
    totalCounts: users.length,
    users,
  });
};

const deleteUser = async (req, res) => {
  const id = req.body.id;
  const { username, password } = req.body.user;

  // validate user input
  const { error, value } = login.validate({ username, password });
  if (error) throw error;

  let [results, _] = await user.getCredentials(id);
  if (results.length === 0)
    throw new AppError("UserNotFound", "User does not exist", 404);

  // compare username
  if (value.username !== results[0].username)
    throw new AppError("WrongCredentials", "Username does not match", 400);

  // compare the password with the one stored in database
  let isHashMatch = await bcrypt.compare(
    value.password,
    results[0].password_hash
  );
  if (!isHashMatch)
    throw new AppError("WrongCredentials", "Incorrect password", 400);

  [results] = await user.deleteUserById(id);
  if (results.affectedRows !== 1)
    throw new AppError("OperationFailed", "no user to deleted", 400);

  return res.status(200).json({
    success: true,
    message: "user is deleted successfully",
  });
};

const changeUsername = async (req, res) => {
  const id = req.body.id;
  const { username } = req.body;

  // validate user input
  const { error, value } = uname.validate({ username });
  if (error) throw error;

  // get old username
  let [results, _] = await user.getCredentials(id);
  if (results.length === 0)
    throw new AppError("UserNotFound", "User does not exist", 404);

  // compare username
  if (value.username === results[0].username)
    throw new AppError("WrongCredentials", "Username must be different.", 400);

  // check if username is available
  [results, _] = await user.getUsers();
  if (results.length === 0)
    throw new AppError("OperationFailed", "no user to retrieved", 400);

  let users = results.map((result) => result.username);
  if (users.includes(value.username))
    throw new Error(`${value.username} already taken`);

  // update username
  [results] = await user.updateUsername(id, value.username);
  if (results.affectedRows !== 1)
    // throw new Error("");
    throw new AppError("OperationFailed", "failed to change the username", 400);

  return res
    .status(200)
    .json({ success: true, message: `Username changed successfully` });
};

const changePassword = async (req, res) => {
  const id = req.body.id;
  const { oldPassword, newPassword, confirmedNewPassword } = req.body;

  // validate user input
  const { error, value } = passwords.validate({
    oldPassword,
    newPassword,
    confirmedNewPassword,
  });
  if (error) throw error;

  if (!value.oldPassword === value.newPassword)
    throw new Error("New password must be different");

  if (value.newPassword !== value.confirmedNewPassword)
    throw new Error("New password must match");

  // get user login credential if exists by username
  let [results, _] = await user.getCredentials(id);
  const oldPasswordHash = results[0].password_hash;

  // validate password old password
  let isHashMatch = await bcrypt.compare(value.oldPassword, oldPasswordHash);
  if (!isHashMatch)
    throw new Error("WrongCredentials", "Incorrect old password", 400);

  // check if old new password is not the same as old password
  isHashMatch = await bcrypt.compare(value.newPassword, oldPasswordHash);
  if (isHashMatch) throw new Error("old password can be a new password");

  // hash new password
  const salt_hash = await bcrypt.genSalt();
  const password_hash = await bcrypt.hash(value.newPassword, salt_hash);

  // update password
  [results, _] = await user.updatePassword(id, password_hash);
  if (results.affectedRows === 0)
    throw new AppError("OperationFailed", "Failed to update password", 400);

  return res
    .status(200)
    .json({ success: true, message: `password changed successfully` });
};

const updateProfile = async (req, res) => {
  const id = req.body.id;
  const {
    full_name,
    sex,
    birth_date,
    phone,
    email,
    avatar_url,
    biography,
    location,
  } = req.body.user;

  // validate user input
  const { error, value } = profile.validate({
    full_name,
    sex,
    birth_date,
    phone,
    email,
    avatar_url,
    biography,
    location,
  });
  if (error) throw error;

  const newUser = {
    full_name: value.full_name || null,
    sex: value.sex || null,
    birth_date: value.birth_date
      ? new Date(value.birth_date).toISOString().slice(0, 19).replace("T", " ")
      : null,
    phone: value.phone || null,
    email: value.email,
    avatar_url: value.avatar_url || null,
    biography: value.biography || null,
    location: value.location || null,
  };

  // update user profile
  let [results, _] = await user.updateUser({ id, ...newUser });
  if (results.affectedRows === 0)
    throw new AppError("OperationFailed", "Failed to update profile", 400);

  return res.status(200).json({
    success: true,
    message: `User profile updated successfully`,
  });
};

export {
  getUser,
  getUsers,
  deleteUser,
  changeUsername,
  changePassword,
  updateProfile,
};
