import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import {
  login,
  passwords,
  profile,
  uname,
} from "../helpers/validator.helper.js";

const user = User.getInstance();

const getUser = async (req, res, next) => {
  const token = req.body.token;

  if (!token) {
    return res.status(409).json({
      success: false,
      message: "jwt must be provided",
    });
  }

  let { err, id } = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    (error, decoded) => {
      return { err: error, id: decoded?.id };
    }
  );

  if (err)
    return res.status(409).json({
      success: false,
      message: "user not verified",
    });

  //
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

  try {
    const { error, value } = login.validate({ username, password });
    if (error)
      return res.status(409).json({
        success: false,
        message: error.details[0].message,
      });

    if (!token) {
      return res.status(409).json({
        success: false,
        message: "jwt must be provided",
      });
    }

    let { err, id } = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      (error, decoded) => {
        return { err: error, id: decoded?.id };
      }
    );

    if (err)
      return res.status(409).json({
        success: false,
        message: "user not verified",
      });

    //
    let [results, _] = await user.getCredentials(id);

    if (results.length === 0)
      return res.status(409).json({
        success: false,
        message: "user does not exist",
      });

    // compare username
    if (value.username !== results[0].username)
      return res.status(409).json({
        success: false,
        message: "username does not exist",
      });

    // compare the password with the one stored in database
    let isHashMatch = await bcrypt.compare(
      value.password,
      results[0].password_hash
    );

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
  } catch (err) {
    return res.status(409).json({
      success: false,
      message: "Something goes wrong",
    });
  }
};

const changeUsername = async (req, res, next) => {
  const { token, username } = req.body;

  try {
    const { error, value } = uname.validate({ username });
    if (error)
      return res.status(409).json({
        success: false,
        message: error.details[0].message,
        data: {
          username,
        },
      });

    if (!token) {
      return res.status(409).json({
        success: false,
        message: "jwt must be provided",
      });
    }

    // verify token
    let { err, id } = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      (error, decoded) => {
        return { err: error, id: decoded?.id };
      }
    );

    if (err)
      return res.status(409).json({
        success: false,
        message: "user not verified",
      });

    // get old username
    let [results, _] = await user.getCredentials(id);

    if (results.length === 0)
      return res.status(409).json({
        success: false,
        message: "user does not exist",
      });

    // compare username
    if (value.username === results[0].username)
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

    if (users.includes(value.username))
      return res.json({
        success: false,
        message: `${value.username} already taken`,
      });

    // update username
    [results] = await user.updateUsername(id, value.username);
    if (results.affectedRows !== 1)
      return res.status(409).json({
        success: false,
        message: "failed to change the username",
      });

    res
      .status(200)
      .json({ success: true, message: `Username changed successfully` });
  } catch (err) {
    return res.status(409).json({
      success: false,
      message: "Something goes wrong",
    });
  }
};

const changePassword = async (req, res, next) => {
  const { token, oldPassword, newPassword, confirmedNewPassword } = req.body;

  try {
    const { error, value } = passwords.validate({
      oldPassword,
      newPassword,
      confirmedNewPassword,
    });

    if (error)
      return res.status(409).json({
        success: false,
        message: error.details[0].message,
      });

    if (!token) {
      return res.status(409).json({
        success: false,
        message: "jwt must be provided",
      });
    }

    if (!value.oldPassword === value.newPassword)
      return res.status(409).json({
        success: false,
        message: "New password must be different",
      });

    if (value.newPassword !== value.confirmedNewPassword)
      return res.status(409).json({
        success: false,
        message: "New password must match",
      });

    let { err, id } = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      (error, decoded) => {
        return { err: error, id: decoded?.id };
      }
    );

    if (err)
      return res.status(409).json({
        success: false,
        message: "user not verified",
      });

    // get user login credential if exists by username
    let [results, _] = await user.getCredentials(id);
    const oldPasswordHash = results[0].password_hash;

    // validate password old password
    let isHashMatch = await bcrypt.compare(value.oldPassword, oldPasswordHash);
    if (!isHashMatch)
      return res.status(409).json({
        success: false,
        message: "Incorrect old password",
      });

    // check if old new password is not the same as old password
    isHashMatch = await bcrypt.compare(value.newPassword, oldPasswordHash);
    if (isHashMatch)
      return res.status(409).json({
        success: false,
        message: "old password can be a new password",
      });

    // hash new password
    const salt_hash = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(value.newPassword, salt_hash);

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
      message: "Something goes wrong",
    });
  }
};

const updateProfile = async (req, res, next) => {
  const token = req.body.token;
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

  try {
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

    if (error)
      return res.status(409).json({
        success: false,
        message: error.details[0].message,
      });

    if (!token) {
      return res.status(409).json({
        success: false,
        message: "jwt must be provided",
      });
    }

    let { err, id } = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      (error, decoded) => {
        return { err: error, id: decoded?.id };
      }
    );

    if (err)
      return res.status(409).json({
        success: false,
        message: "user not verified",
      });

    const newUser = {
      full_name: value.full_name || null,
      sex: value.sex || null,
      birth_date: value.birth_date
        ? new Date(value.birth_date)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ")
        : null,
      phone: value.phone || null,
      email: value.email,
      avatar_url: value.avatar_url || null,
      biography: value.biography || null,
      location: value.location || null,
    };

    // update user profile
    let [results, _] = await user.updateUser({ id, ...newUser });
    if (results.affectedRows === 0) {
      return res.status(409).json({
        success: false,
        message: "something goes wrong",
      });
    }

    res.status(200).json({
      success: true,
      message: `User profile updated successfully`,
    });
  } catch (err) {
    //
  }
};

export { getUser, deleteUser, changeUsername, changePassword, updateProfile };
