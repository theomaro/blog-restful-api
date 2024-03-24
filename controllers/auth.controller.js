import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import AuthUser from "../models/auth.model.js";
import { register, login } from "../helpers/validator.helper.js";

const auth = AuthUser.getInstance();

const signUp = async (req, res, next) => {
  // load form data
  const { email, username, password, confirmed_password } = await req.body;

  try {
    // validate form data
    await register.validateAsync({
      email,
      username,
      password,
      confirmed_password,
    });

    // check if email already existed
    let [results, _] = await auth.isEmailExist(email);
    if (results.length !== 0)
      return res.status(409).json({
        success: false,
        message: "email already exists",
        data: { email, username, password, confirmed_password },
      });

    // check if username already existed
    [results, _] = await auth.isUsernameExist(username);
    if (results.length !== 0)
      return res.status(409).json({
        success: false,
        message: "username has already been taken",
        data: {
          email,
          username,
          password,
          confirmed_password,
        },
      });

    // hash the password
    const salt_hash = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt_hash);

    // create a new user
    [results] = await auth.registerUser(email, username, password_hash);
    if (results.affectedRows !== 1) {
      return res
        .status(500)
        .json({ success: false, message: "Something bad happened" });
    }

    res.status(201).json({
      success: true,
      message: "user registered successfully",
    });
  } catch (err) {
    let message = err ? err.details[0].message : "";

    return res.status(409).json({
      success: false,
      message: message.includes("[ref:") ? "Password does not match" : message,
      data: {
        email,
        username,
        password,
        confirmed_password,
      },
    });
  }
};

const signIn = async (req, res, next) => {
  // load form data
  const input_username = req.body.username;
  const input_password = req.body.password;

  try {
    // validate form data
    await login.validateAsync({
      username: input_username,
      password: input_password,
    });

    // check if username already existed
    let [results, _] = await auth.isUsernameExist(input_username);
    if (results.length === 0)
      return res.status(409).json({
        success: false,
        message: "username does not exists",
        data: { username: input_username },
      });

    // get user login credential if exists by username
    let user = await auth.getUserBy(input_username);
    const { id, password_hash } = user[0][0];

    // compare the password with the one stored in database
    let isHashMatch = await bcrypt.compare(input_password, password_hash);

    if (!isHashMatch)
      return res.status(409).json({
        success: false,
        message: "Incorrect password",
        data: { username: input_username, password: input_password },
      });

    // generate web token
    const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    // set the cookie options

    // update last login
    await auth.updateLastLogin(id);

    // login in the user
    res.status(200).json({
      success: true,
      message: "user has been logged in",
      token,
      expiresIn: process.env.COOKIE_EXPIRES, // nth days in seconds
    });
  } catch (err) {
    let message = err.details[0].message;

    return res.status(409).json({
      success: false,
      message,
      data: { username: input_username, password: input_password },
    });
  }
};

export { signUp, signIn };
