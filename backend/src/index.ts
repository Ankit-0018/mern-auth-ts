import express from "express";
import "dotenv/config";
import { APP_ORIGIN, PORT } from "./constants/env";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler";
import { OK } from "./constants/http";
import authRoutes from "./routes/auth.route";
import userRouter from "./routes/user.route";
import { authenticate } from "./middlewares/authenticate";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(OK).json({
    status: "healthy",
  });
});

app.use("/auth", authRoutes);
app.use("/user", authenticate, userRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
