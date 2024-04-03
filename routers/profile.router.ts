import { Router } from "express";
import {
  changePassword,
  changeUsername,
  deleteProfile,
  getProfile,
  updateProfile,
} from "../../controllers/profile.controller.js";
import tryCatch from "../../helpers/tryCatch.helper.js";

const profileRouter = new Router();

profileRouter
  .route("/")
  .post(tryCatch(getProfile))
  .delete(tryCatch(deleteProfile))
  .put(tryCatch(updateProfile));

profileRouter.route("/change-username").put(tryCatch(changeUsername));
profileRouter.route("/change-password").put(tryCatch(changePassword));

export default profileRouter;
