import { Router } from "express";
import { signIn, signUp, getUser } from "../controllers/auth.controller.js";

const authRouter = new Router();

authRouter.route("/signup").post(signUp);
authRouter.route("/signin").post(signIn);
authRouter.route("/user").post(getUser);

export default authRouter;
