import express from "express";
import tryCatch from "../helpers/tryCatch.helper.js";
import { getComments } from "../controllers/comments.controller.js";

const commentsRouter = express.Router();

commentsRouter.route("/").post(tryCatch(getComments));

export default commentsRouter;
