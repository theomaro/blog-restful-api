import { Router } from "express";
import {
  changePassword,
  changeUsername,
  deleteUser,
  getUser,
  updateProfile,
} from "../controllers/user.controller.js";

const userRouter = new Router();

userRouter.route("/").post(getUser).delete(deleteUser);
userRouter.route("/change-username").put(changeUsername);
userRouter.route("/change-password").put(changePassword);
userRouter.route("/update").put(updateProfile);

export default userRouter;
