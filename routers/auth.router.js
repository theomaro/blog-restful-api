import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller.js";

const authRouter = new Router();

authRouter.route("/signup").post(signUp);
authRouter.route("/signin").post(signIn);

export default authRouter;
