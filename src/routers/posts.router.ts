import express from "express";
import {
  changePostStatus,
  getPost,
  getPosts,
} from "../controllers/posts.controller.js";
import tryCatch from "../helpers/tryCatch.helper.js";

const postsRouter = express.Router();

postsRouter.route("/:slug_url/change-status").post(tryCatch(changePostStatus));
postsRouter.route("/:slug_url").post(tryCatch(getPost));
postsRouter.route("/").post(tryCatch(getPosts));

export default postsRouter;