import jwt from "jsonwebtoken";

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
    return res.status(409).json({
      success: false,
      message: "user not verified",
    });

  req.body.id = id;

  next();
};

export { userAuthN };
