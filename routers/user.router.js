import { Router } from "express";
import {
  changePassword,
  changeUsername,
  deleteUser,
  getUser,
  updateProfile,
} from "../controllers/user.controller.js";
import tryCatch from "../helpers/tryCatch.helper.js";

const userRouter = new Router();

userRouter.route("/").post(tryCatch(getUser)).delete(tryCatch(deleteUser));
userRouter.route("/change-username").put(tryCatch(changeUsername));
userRouter.route("/change-password").put(tryCatch(changePassword));
userRouter.route("/update").put(tryCatch(updateProfile));

export default userRouter;
