import "dotenv/config";
import morgan from "morgan";
import express from "express";
import { createWriteStream } from "fs";
import cors from "cors";

import authRouter from "./routers/auth.router.js";
import profileRouter from "./routers/profile.router.js";
import usersRouter from "./routers/users.router.js";
import { userAuthN, userAuthZ } from "./middlewares/auth.middleware.js";
import tryCatch from "./helpers/tryCatch.helper.js";
import postsRouter from "./routers/posts.router.js";
import commentsRouter from "./routers/comments.router.js";

const port: string | number = process.env.SERVER_PORT
  ? parseInt(process.env.SERVER_PORT)
  : 3000;
const hostname = process.env.SERVER_HOSTNAME || "localhost";

const app = express();

if (app.get("env") == "production") {
  // log to a file on production
  const accessLogStream = createWriteStream("logs/access.log", { flags: "a" });
  app.use(morgan("combined", { stream: accessLogStream }));
} else {
  app.use(morgan("dev")); // log to console on development
}

//
app.use(cors());

// parse application/json
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// configure url routes
app.use("/api/auth", authRouter);
app.use(
  "/api/users",
  [tryCatch(userAuthN), tryCatch(userAuthZ("admin"))],
  usersRouter
);
app.use(
  "/api/profile",
  [tryCatch(userAuthN), tryCatch(userAuthZ("admin"))],
  profileRouter
);
app.use(
  "/api/posts",
  [tryCatch(userAuthN), tryCatch(userAuthZ("admin"))],
  postsRouter
);
app.use(
  "/api/comments",
  [tryCatch(userAuthN), tryCatch(userAuthZ("admin"))],
  commentsRouter
);

// configure error handlers

// Initialize server
app.listen(port, hostname, () => {
  console.log(`Server is listening at ${hostname}:${port}`);
});
