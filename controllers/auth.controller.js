import bcrypt from "bcryptjs";

import AuthUser from "../models/auth.model.js";
import { register } from "../helpers/validator.helper.js";

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
  res.status(200).json("sign in");
};

export { signUp, signIn };
