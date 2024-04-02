import jwt from "jsonwebtoken";
import Profile from "../models/profile.model.js";
import AppError from "./errors.middleware.js";

const userAuthN = (req, res, next) => {
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
    return res.status(403).json({
      success: false,
      message: "user not verified",
    });

  req.body.id = id;

  next();
};

const userAuthZ = (role) => async (req, res, next) => {
  const profile = Profile.getInstance();

  try {
    const [results, _] = await profile.getProfile(req.body.id);
    if (results.length === 0)
      throw new AppError("UserNotFound", "User does not exist", 404);

    if (results[0].current_role !== role)
      throw new AppError("PermissionError", "user not authorized", 401);

    next();
  } catch (error) {
    next(error);
  }
};

export { userAuthN, userAuthZ };
