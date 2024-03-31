import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import AuthUser from "../models/auth.model.js";
import { register, login } from "../helpers/validator.helper.js";

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
  if (error) {
    let message = error.details[0].message ?? "";
    throw new Error(
      message.includes("[ref:") ? "Password does not match" : message
    );
  }

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
  if (results.affectedRows !== 1) throw new Error("Something bad happened");

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
  if (error) throw new Error(error.details[0].message);

  // check if username already existed
  let [results, _] = await auth.isUsernameExist(value.username);
  if (results.length === 0) throw new Error("username does not exists");

  // get user login credential if exists by username
  let user = await auth.getUserBy(value.username);
  const { id, password_hash } = user[0][0];

  // compare the password with the one stored in database
  let isHashMatch = await bcrypt.compare(value.password, password_hash);
  if (!isHashMatch) throw new Error("Incorrect password");

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
