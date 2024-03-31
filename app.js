import "dotenv/config"; // load enviroment variables
import morgan from "morgan";
import { createWriteStream } from "fs";
import express from "express";
import authRouter from "./routers/auth.router.js";
import userRouter from "./routers/user.router.js";
import { userAuthN } from "./middlewares/auth.middleware.js";
import errorHandler from "./middlewares/errors.middleware.js";

const port = process.env.SERVER_PORT || 3000;
const hostname = process.env.SERVER_HOSTNAME || "localhost";

const app = express();

if (app.get("env") == "production") {
  // log to a file on production
  const accessLogStream = createWriteStream("logs/access.log", { flags: "a" });
  app.use(morgan("combined", { stream: accessLogStream }));
} else {
  app.use(morgan("dev")); // log to console on development
}

// parse application/json
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// configure url routes
app.use("/api/auth", authRouter);
app.use("/api/users", [userAuthN], userRouter);

// configure error handler
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Server is listening at ${hostname}:${port}`);
});
