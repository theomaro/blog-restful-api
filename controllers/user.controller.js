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

export { getUser };
