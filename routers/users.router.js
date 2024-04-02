import { Router } from "express";

import tryCatch from "../helpers/tryCatch.helper.js";
import { getUsers } from "../controllers/users.controller.js";

const usersRouter = new Router();

usersRouter.route("/").get(tryCatch(getUsers));

export default usersRouter;
