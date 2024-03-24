import AuthUser from "../models/auth.model.js";

const auth = AuthUser.getInstance();

const signUp = async (req, res, next) => {
  res.status(200).json("sign up");
};

const signIn = async (req, res, next) => {
  res.status(200).json("sign in");
};

export { signUp, signIn };
