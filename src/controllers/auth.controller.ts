import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, RequestHandler, Response } from "express";

import AppError from "../middlewares/errors.middleware.js";
import {
  registerValidator,
  loginValidator,
} from "../helpers/validator.helper.js";
import UserAuth from "../models/auth.model.js";

const userAuth = UserAuth.getInstance();

const signUp: RequestHandler = async (req: Request, res: Response) => {
  // load form data
  const { email, username, password, confirmed_password } = req.body;

  // validate form data
  let { error, value } = registerValidator.validate({
    email,
    username,
    password,
    confirmed_password,
  });
  if (error) throw error;

  // check if email already existed
  let isEmail = await userAuth.isEmailExist(value.email);
  if (isEmail) throw new Error("email already exists");

  // check if username already existed
  let isUsername = await userAuth.isUsernameExist(value.username);
  if (isUsername) throw new Error("username has already been taken");

  // hash the password
  const salt_hash = await bcrypt.genSalt();
  const password_hash = await bcrypt.hash(value.password, salt_hash);

  // create a new user
  let results = await userAuth.registerUser(
    value.email,
    value.username,
    password_hash
  );
  if (results.affectedRows !== 1)
    throw new AppError("OperationFailed", "Failed to register a user", 400);

  res.status(201).json({
    success: true,
    message: "user registered successfully",
  });
};

const signIn: RequestHandler = async (req: Request, res: Response) => {
  // load form data
  let { username, password } = req.body;

  // validate form data
  let { error, value } = loginValidator.validate({
    username,
    password,
  });
  if (error) throw error;

  // check if username already existed Jos2018(Mat
  let isUsername = await userAuth.isUsernameExist(value.username);
  if (!isUsername)
    throw new AppError("WrongCredentials", "Incorrect username", 400);

  // get user login credential if exists by username
  let { id, password_hash, current_role } = await userAuth.getUserBy(
    value.username
  );

  // compare the password with the one stored in database
  let isHashMatch = await bcrypt.compare(value.password, password_hash);
  if (!isHashMatch)
    throw new AppError("WrongCredentials", "Incorrect password", 400);

  if (current_role !== "admin")
    throw new AppError("PermissionError", "You are not authorized", 400);

  if (!process.env.JWT_SECRET_KEY)
    throw new AppError("ExpectedError", "JWT_SECRET_KEY is not defined", 400);

  // generate web token
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  // update last login
  let results = await userAuth.updateLastLogin(id);
  if (results.affectedRows !== 1)
    throw new AppError("OperationFailed", "Failed to register a user", 400);

  if (!process.env.COOKIE_EXPIRES)
    throw new AppError("ExpectedError", "COOKIE_EXPIRES is not defined", 400);

  // login in the user
  res.status(200).json({
    success: true,
    message: "user has been logged in",
    token,
    expiresIn: parseInt(process.env.COOKIE_EXPIRES) * 60 * 60, // nth hours in seconds
  });
};

export { signUp, signIn };
