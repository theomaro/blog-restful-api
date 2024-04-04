import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";
import Profile from "../models/profile.model.js";

const userAuthN: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.body.token;
  if (!token) throw new Error("token must be provided");

  if (!process.env.JWT_SECRET_KEY)
    throw new Error("JWT_SECRET_KEY must be define");
  const decoded: string | JwtPayload = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY
  );
  if (!decoded) throw new Error("user not verified");

  let data: {
    id: string;
    iat: number;
    exp: number;
  } = JSON.parse(JSON.stringify(decoded));

  req.body.id = data.id;

  next();
};

const userAuthZ =
  (role: string): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    const profile = Profile.getInstance();

    const userProfile = await profile.getProfile(req.body.id);
    if (!userProfile) throw new Error("User does not exist");

    if (userProfile.current_role !== role)
      throw new Error("user not authorized");

    next();
  };

export { userAuthN, userAuthZ };
