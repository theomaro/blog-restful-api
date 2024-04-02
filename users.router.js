import { Router } from "express";

const usersRouter = new Router();

usersRouter.route("/all").post(tryCatch(getUsers));
