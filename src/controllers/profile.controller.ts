import bcrypt from "bcryptjs";
import Profile from "../models/profile.model.js";
import {
  loginValidator,
  passwordsValidator,
  profileValidator,
  usernameValidator,
} from "../helpers/validator.helper.js";
import AppError from "../middlewares/errors.middleware.js";
import { Request, RequestHandler, Response } from "express";

const profile = Profile.getInstance();

export const getProfile: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.body;

  const userProfile = await profile.getProfile(id);
  if (!userProfile)
    throw new AppError("UserNotFound", "User does not exist", 404);

  return res.status(200).json({
    success: true,
    message: "user data retrieved",
    user: userProfile,
  });
};

export const deleteProfile: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id, user } = req.body;
  const { username, password } = user;

  // validate user input
  const { error, value } = loginValidator.validate({ username, password });
  if (error) throw error;

  let credentials = await profile.getCredentials(id);
  if (!credentials)
    throw new AppError("UserNotFound", "User does not exist", 404);

  // compare username
  if (value.username !== credentials.username)
    throw new AppError("WrongCredentials", "Username does not match", 400);

  // compare the password with the one stored in database
  let isHashMatch = await bcrypt.compare(
    value.password,
    credentials.password_hash
  );
  if (!isHashMatch)
    throw new AppError("WrongCredentials", "Incorrect password", 400);

  let results = await profile.deleteProfile(id);
  if (results.affectedRows !== 1)
    throw new AppError("OperationFailed", "no user to deleted", 400);

  return res.status(200).json({
    success: true,
    message: "user is deleted successfully",
  });
};

export const updateProfile: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id, user } = req.body;
  const {
    full_name,
    sex,
    birth_date,
    phone,
    email,
    avatar_url,
    biography,
    location,
  } = user;

  // validate user input
  const { error, value } = profileValidator.validate({
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

  const newProfile: any = {
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
  let results = await profile.updateProfile({ id, ...newProfile });
  if (results.affectedRows === 0)
    throw new AppError("OperationFailed", "Failed to update profile", 400);

  return res.status(200).json({
    success: true,
    message: `User profile updated successfully`,
  });
};

export const changeUsername: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id, username } = req.body;

  // validate user input
  const { error, value } = usernameValidator.validate({ username });
  if (error) throw error;

  // get old username
  let credentials = await profile.getCredentials(id);
  if (!credentials)
    throw new AppError("UserNotFound", "User does not exist", 404);

  // compare username
  if (value.username === credentials.username)
    throw new AppError("WrongCredentials", "Username must be different.", 400);

  // check if username is available
  let usernames = await profile.getUsernames();
  if (usernames.length === 0)
    throw new AppError("OperationFailed", "no user to retrieved", 400);

  let users = usernames.map((result: any) => result.username);
  if (users.includes(value.username))
    throw new Error(`${value.username} already taken`);

  // update username
  let results = await profile.updateUsername(id, value.username);
  if (results.affectedRows !== 1)
    throw new AppError("OperationFailed", "failed to change the username", 400);

  return res
    .status(200)
    .json({ success: true, message: `Username changed successfully` });
};

export const changePassword = async (req: Request, res: Response) => {
  const { id, oldPassword, newPassword, confirmedNewPassword } = req.body;

  // validate user input
  const { error, value } = passwordsValidator.validate({
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
  let credentials = await profile.getCredentials(id);
  const oldPasswordHash = credentials.password_hash;

  // validate password old password
  let isHashMatch = await bcrypt.compare(value.oldPassword, oldPasswordHash);
  if (!isHashMatch)
    throw new AppError("WrongCredentials", "Incorrect old password", 400);

  // check if old new password is not the same as old password
  isHashMatch = await bcrypt.compare(value.newPassword, oldPasswordHash);
  if (isHashMatch) throw new Error("old password can be a new password");

  // hash new password
  const salt_hash = await bcrypt.genSalt();
  const password_hash = await bcrypt.hash(value.newPassword, salt_hash);

  // update password
  let results = await profile.updatePassword(id, password_hash);
  if (results.affectedRows === 0)
    throw new AppError("OperationFailed", "Failed to update password", 400);

  return res
    .status(200)
    .json({ success: true, message: `password changed successfully` });
};
