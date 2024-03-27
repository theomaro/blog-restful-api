import { Router } from "express";
import {
  changePassword,
  changeUsername,
  deleteUser,
  getUser,
} from "../controllers/user.controller.js";

const userRouter = new Router();

userRouter.route("/").post(getUser).delete(deleteUser);
userRouter.route("/change-username").put(changeUsername);
userRouter.route("/change-password").put(changePassword);

export default userRouter;
