import { Request, Response } from "express";
import { CREATED, OK } from "../constants/http";
import { createAccount, loginUser } from "../services/auth.service";
import setAuthCookies from "../utils/cookies";
import { registerSchema, loginSchema } from "./auth.schema";

export const registerHandler = async (req: Request, res: Response) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  const { user, accessToken, refreshToken } = await createAccount(request);

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
};

export const loginHandler = async (req: Request, res: Response) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { accessToken, refreshToken } = await loginUser(request);
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .json({ message: "Login successful" });
};
