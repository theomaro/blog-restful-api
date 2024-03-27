import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

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

  //

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

export { getUser, deleteUser };
