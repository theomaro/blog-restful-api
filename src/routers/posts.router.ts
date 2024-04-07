import express from "express";
import { getPosts } from "../controllers/posts.controller.js";
import tryCatch from "../helpers/tryCatch.helper.js";

const postsRouter = express.Router();

postsRouter.route("/").post(tryCatch(getPosts));

export default postsRouter;
