import { Router } from "express";
import {
  changeUsername,
  deleteUser,
  getUser,
} from "../controllers/user.controller.js";

const userRouter = new Router();

userRouter.route("/").post(getUser).delete(deleteUser);
userRouter.route("/change-username").put(changeUsername);

export default userRouter;
