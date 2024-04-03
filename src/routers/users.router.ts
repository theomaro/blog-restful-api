import express from "express";

import tryCatch from "../helpers/tryCatch.helper.js";
import { getUser, getUsers } from "../controllers/users.controller.js";

const usersRouter = express.Router();

usersRouter.route("/:username").post(tryCatch(getUser));
usersRouter.route("/").post(tryCatch(getUsers));

export default usersRouter;
