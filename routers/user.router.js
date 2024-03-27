import { Router } from "express";
import { getUser } from "../controllers/user.controller.js";

const userRouter = new Router();

userRouter.route("/").post(getUser);

export default userRouter;
