import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import AuthUser from "../models/auth.model.js";
import { register, login } from "../helpers/validator.helper.js";
import AppError from "../middlewares/errors.middleware.js";

const auth = AuthUser.getInstance();

const signUp = async (req, res, next) => {
  // load form data
  const { email, username, password, confirmed_password } = await req.body;

  // validate form data
  let { error, value } = register.validate({
    email,
    username,
    password,
    confirmed_password,
  });
  if (error) throw error;

  // check if email already existed
  let [results, _] = await auth.isEmailExist(value.email);
  if (results.length !== 0) throw new Error("email already exists");

  // check if username already existed
  [results, _] = await auth.isUsernameExist(value.username);
  if (results.length !== 0) throw new Error("username has already been taken");

  // hash the password
  const salt_hash = await bcrypt.genSalt();
  const password_hash = await bcrypt.hash(value.password, salt_hash);

  // create a new user
  [results] = await auth.registerUser(
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

const signIn = async (req, res, next) => {
  // load form data
  let { username, password } = req.body;

  // validate form data
  let { error, value } = login.validate({
    username,
    password,
  });
  if (error) throw error;

  // check if username already existed Jos2018(Mat
  let [results, _] = await auth.isUsernameExist(value.username);
  if (results.length === 0)
    throw new AppError("WrongCredentials", "Incorrect username", 400);

  // get user login credential if exists by username
  let user = await auth.getUserBy(value.username);
  const { id, password_hash, current_role } = user[0][0];

  // compare the password with the one stored in database
  let isHashMatch = await bcrypt.compare(value.password, password_hash);
  if (!isHashMatch)
    throw new AppError("WrongCredentials", "Incorrect password", 400);

  if (current_role !== "admin")
    throw new AppError("PermissionError", "You are not authorized", 400);

  // generate web token
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  // update last login
  await auth.updateLastLogin(id);

  // login in the user
  res.status(200).json({
    success: true,
    message: "user has been logged in",
    token,
    expiresIn: process.env.COOKIE_EXPIRES * 24 * 60 * 60, // nth days in seconds
  });
};

export { signUp, signIn };
