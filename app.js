import "dotenv/config"; // load enviroment variables
import express from "express";
import authRouter from "./routers/auth.router.js";
import userRouter from "./routers/user.router.js";

const port = process.env.SERVER_PORT || 3000;
const hostname = process.env.SERVER_HOSTNAME || "localhost";

const app = express();

// parse application/json
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// configure url routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.listen(port, hostname, () => {
  console.log(`Server is listening at ${hostname}:${port}`);
});
