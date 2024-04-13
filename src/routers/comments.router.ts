import express from "express";
import tryCatch from "../helpers/tryCatch.helper.js";
import {
  getComment,
  getComments,
  changeStatus,
  deleteComment,
} from "../controllers/comments.controller.js";

const commentsRouter = express.Router();

commentsRouter.route("/:id/change-status").post(tryCatch(changeStatus));
commentsRouter
  .route("/:id")
  .post(tryCatch(getComment))
  .delete(tryCatch(deleteComment));
commentsRouter.route("/").post(tryCatch(getComments));

export default commentsRouter;
