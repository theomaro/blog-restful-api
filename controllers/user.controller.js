import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { passwords } from "../helpers/validator.helper.js";

const user = User.getInstance();

const getUser = async (req, res, next) => {
  const token = req.body.token;

  if (!token) {
    return res.status(409).json({
      success: false,
      message: "jwt must be provided",
    });
  }

  let isVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!isVerified)
    return res.status(409).json({
      success: false,
      message: "user not verified",
    });

  let { id } = jwt.decode(token);
  const [results, _] = await user.getUserById(id);

  if (results.length === 0)
    return res.status(409).json({
      success: false,
      message: "something goes wrong",
    });

  res.status(200).json({
    success: true,
    message: "user is authenticated",
    user: results[0],
  });
};

const deleteUser = async (req, res, next) => {
  const token = req.body.token;
  const { username, password } = req.body.user;

  if (!token) {
    return res.status(409).json({
      success: false,
      message: "jwt must be provided",
    });
  }

  let isVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!isVerified)
    return res.status(409).json({
      success: false,
      message: "user not verified",
    });

  let { id } = jwt.decode(token);
  let [results, _] = await user.getCredentials(id);

  if (results.length === 0)
    return res.status(409).json({
      success: false,
      message: "user does not exist",
    });

  // compare username
  if (username !== results[0].username)
    return res.status(409).json({
      success: false,
      message: "username does not exist",
    });

  // compare the password with the one stored in database
  let isHashMatch = await bcrypt.compare(password, results[0].password_hash);

  if (!isHashMatch)
    return res.status(409).json({
      success: false,
      message: "Incorrect password",
    });

  [results] = await user.deleteUserById(id);

  if (results.affectedRows !== 1)
    return res.status(409).json({
      success: false,
      message: "no user to deleted",
    });

  res.status(200).json({
    success: true,
    message: "user is deleted successfully",
  });
};

const changeUsername = async (req, res, next) => {
  const { token, username } = req.body;

  // verify token
  let isVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!isVerified)
    return res.status(409).json({
      success: false,
      message: "user not verified",
    });

  // get old username
  let { id } = jwt.decode(token);
  let [results, _] = await user.getCredentials(id);

  if (results.length === 0)
    return res.status(409).json({
      success: false,
      message: "user does not exist",
    });

  // compare username
  if (username === results[0].username)
    return res.status(409).json({
      success: false,
      message: "Username must be different.",
    });

  // check if username is available
  [results, _] = await user.getUsers();

  if (results.length === 0)
    return res.status(409).json({
      success: false,
      message: "something goes wrong",
    });

  let users = results.map((result) => result.username);

  if (users.includes(username))
    return res.json({
      success: false,
      message: `${username} already taken`,
    });

  // update username
  [results] = await user.updateUsername(id, username);
  if (results.affectedRows !== 1)
    return res.status(409).json({
      success: false,
      message: "failed to change the username",
    });

  res
    .status(200)
    .json({ success: true, message: `Username changed successfully` });
};

const changePassword = async (req, res, next) => {
  const { token, oldPassword, newPassword, confirmedNewPassword } = req.body;

  try {
    await passwords.validateAsync({
      oldPassword,
      newPassword,
      confirmedNewPassword,
    });

    if (!oldPassword === newPassword)
      return res.status(409).json({
        success: false,
        message: "New password must be different",
      });

    if (newPassword !== confirmedNewPassword)
      return res.status(409).json({
        success: false,
        message: "New password must match",
      });

    let isVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!isVerified)
      return res.status(409).json({
        success: false,
        message: "user not verified",
      });

    let { id } = jwt.decode(token);

    // get user login credential if exists by username
    let [results, _] = await user.getCredentials(id);
    const oldPasswordHash = results[0].password_hash;

    // validate password old password
    let isHashMatch = await bcrypt.compare(oldPassword, oldPasswordHash);
    if (!isHashMatch)
      return res.status(409).json({
        success: false,
        message: "Incorrect old password",
      });

    // check if old new password is not the same as old password
    isHashMatch = await bcrypt.compare(newPassword, oldPasswordHash);
    if (isHashMatch)
      return res.status(409).json({
        success: false,
        message: "old password can be a new password",
      });

    // hash new password
    const salt_hash = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(newPassword, salt_hash);

    // update password
    [results, _] = await user.updatePassword(id, password_hash);
    if (results.affectedRows === 0) {
      return res
        .status(500)
        .json({ success: false, message: "Something bad happened" });
    }

    res
      .status(200)
      .json({ success: true, message: `password changed successfully` });
  } catch (err) {
    return res.status(409).json({
      success: false,
      message: err.details[0].message,
    });
  }
};

export { getUser, deleteUser, changeUsername, changePassword };
