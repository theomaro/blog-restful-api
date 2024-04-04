import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, RequestHandler, Response } from "express";
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
  if (error) {
    let message = error.details[0].message;
    message = message.includes("[ref:") ? "Password does not match" : message;
    throw new Error(message);
  }

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
  if (results.affectedRows !== 1) throw new Error("Failed to register a user");

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
  if (error) throw new Error(error.details[0].message);

  // check if username already existed Jos2018(Mat
  let isUsername = await userAuth.isUsernameExist(value.username);
  if (!isUsername) throw new Error("Incorrect username");

  // get user login credential if exists by username
  let { id, password_hash, current_role } = await userAuth.getUserBy(
    value.username
  );

  // compare the password with the one stored in database
  let isHashMatch = await bcrypt.compare(value.password, password_hash);
  if (!isHashMatch) throw new Error("Incorrect password");

  if (current_role !== "admin") throw new Error("You are not authorized");

  if (!process.env.JWT_SECRET_KEY)
    throw new Error("JWT_SECRET_KEY is not defined");

  // generate web token
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  // update last login
  let results = await userAuth.updateLastLogin(id);
  if (results.affectedRows !== 1) throw new Error("Failed to register a user");

  if (!process.env.COOKIE_EXPIRES)
    throw new Error("COOKIE_EXPIRES is not defined");

  // login in the user
  res.status(200).json({
    success: true,
    message: "user has been logged in",
    token,
    expiresIn: parseInt(process.env.COOKIE_EXPIRES) * 60 * 60, // nth hours in seconds
  });
};

export { signUp, signIn };
