import express from "express";
import tryCatch from "../helpers/tryCatch.helper.js";
import { getComment, getComments } from "../controllers/comments.controller.js";

const commentsRouter = express.Router();

commentsRouter.route("/:id").post(tryCatch(getComment));
commentsRouter.route("/").post(tryCatch(getComments));

export default commentsRouter;
