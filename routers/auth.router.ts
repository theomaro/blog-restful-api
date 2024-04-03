import { Router } from "express";
import { signIn, signUp } from "../../controllers/auth.controller.js";
import tryCatch from "../../helpers/tryCatch.helper.js";

const authRouter = new Router();

authRouter.route("/signup").post(tryCatch(signUp));
authRouter.route("/signin").post(tryCatch(signIn));

export default authRouter;
