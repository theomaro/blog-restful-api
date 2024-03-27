import { Router } from "express";
import { deleteUser, getUser } from "../controllers/user.controller.js";

const userRouter = new Router();

userRouter.route("/").post(getUser).delete(deleteUser);

export default userRouter;
