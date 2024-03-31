import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {
  login,
  passwords,
  profile,
  uname,
} from "../helpers/validator.helper.js";

const user = User.getInstance();

const getUser = async (req, res) => {
  const id = req.body.id;

  const [results, _] = await user.getUserById(id);
  if (results.length === 0) throw new Error("User not found");

  return res.status(200).json({
    success: true,
    message: "user is authenticated",
    user: results[0],
  });
};

const deleteUser = async (req, res, next) => {
  const id = req.body.id;
  const { username, password } = req.body.user;

  // validate user input
  const { error, value } = login.validate({ username, password });
  if (error) throw new Error(error.details[0].message);

  let [results, _] = await user.getCredentials(id);
  if (results.length === 0) throw new Error("user does not exist");

  // compare username
  if (value.username !== results[0].username) throw new Error();

  // compare the password with the one stored in database
  let isHashMatch = await bcrypt.compare(
    value.password,
    results[0].password_hash
  );
  if (!isHashMatch) throw new Error("Incorrect password");

  [results] = await user.deleteUserById(id);
  if (results.affectedRows !== 1) throw new Error("no user to deleted");

  return res.status(200).json({
    success: true,
    message: "user is deleted successfully",
  });
};

const changeUsername = async (req, res, next) => {
  const id = req.body.id;
  const { username } = req.body;

  // validate user input
  const { error, value } = uname.validate({ username });
  if (error) throw new Error(error.details[0].message);

  // get old username
  let [results, _] = await user.getCredentials(id);
  if (results.length === 0) throw new Error("user does not exist");

  // compare username
  if (value.username === results[0].username)
    throw new Error("Username must be different.");

  // check if username is available
  [results, _] = await user.getUsers();
  if (results.length === 0) throw new Error("something goes wrong");

  let users = results.map((result) => result.username);
  if (users.includes(value.username))
    throw new Error(`${value.username} already taken`);

  // update username
  [results] = await user.updateUsername(id, value.username);
  if (results.affectedRows !== 1)
    throw new Error("failed to change the username");

  return res
    .status(200)
    .json({ success: true, message: `Username changed successfully` });
};

const changePassword = async (req, res, next) => {
  const id = req.body.id;
  const { oldPassword, newPassword, confirmedNewPassword } = req.body;

  // validate user input
  const { error, value } = passwords.validate({
    oldPassword,
    newPassword,
    confirmedNewPassword,
  });
  if (error) throw new Error(error.details[0].message);

  if (!value.oldPassword === value.newPassword)
    throw new Error("New password must be different");

  if (value.newPassword !== value.confirmedNewPassword)
    throw new Error("New password must match");

  // get user login credential if exists by username
  let [results, _] = await user.getCredentials(id);
  const oldPasswordHash = results[0].password_hash;

  // validate password old password
  let isHashMatch = await bcrypt.compare(value.oldPassword, oldPasswordHash);
  if (!isHashMatch) throw new Error("Incorrect old password");

  // check if old new password is not the same as old password
  isHashMatch = await bcrypt.compare(value.newPassword, oldPasswordHash);
  if (isHashMatch) throw new Error("old password can be a new password");

  // hash new password
  const salt_hash = await bcrypt.genSalt();
  const password_hash = await bcrypt.hash(value.newPassword, salt_hash);

  // update password
  [results, _] = await user.updatePassword(id, password_hash);
  if (results.affectedRows === 0) throw new Error("Something bad happened");

  return res
    .status(200)
    .json({ success: true, message: `password changed successfully` });
};

const updateProfile = async (req, res, next) => {
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
  let { value, error } = profile.validate({
    full_name,
    sex,
    birth_date,
    phone,
    email,
    avatar_url,
    biography,
    location,
  });
  if (error) throw new Error(error.details[0].message);

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
  if (results.affectedRows === 0) throw new Error("something goes wrong");

  return res.status(200).json({
    success: true,
    message: `User profile updated successfully`,
  });
};

export { getUser, deleteUser, changeUsername, changePassword, updateProfile };
