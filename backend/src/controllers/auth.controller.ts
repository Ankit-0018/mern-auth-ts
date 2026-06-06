import { Request, Response } from "express";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import {
  createAccount,
  creatNewPasword,
  loginUser,
  refreshUserAccessToken,
  sendPasswordResetEmail,
  verifyEmail,
} from "../services/auth.service";
import { setAuthCookies, clearAuthCookies } from "../utils/cookies";
import {
  registerSchema,
  loginSchema,
  emailSchema,
  passwordResetSchema,
  verificationCodeSchema,
} from "./auth.schema";
import { verifyToken } from "../utils/jwt";
import sessionModel from "../models/session.model";
import appAssert from "../utils/appAssert";

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

export const logoutHandler = async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;
  const { payload } = verifyToken(accessToken);
  if (payload) {
    await sessionModel.findByIdAndDelete(payload.sessionId);
  }

  return clearAuthCookies(res)
    .status(OK)
    .json({ message: "Logout successful" });
};

export const refreshHandler = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, "Refresh token not found");

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshUserAccessToken(refreshToken);
  return setAuthCookies({ res, accessToken, refreshToken: newRefreshToken })
    .status(OK)
    .json({ message: "Access Token refreshed successfully" });
};

export const verifyEmailHandler = async (req: Request, res: Response) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code);

  await verifyEmail(verificationCode);

  return res.status(OK).json({ message: "Email verified successfully" });
};

export const sendPasswordResetEmailHandler = async (
  req: Request,
  res: Response,
) => {
  const email = emailSchema.parse(req.body.email);

  await sendPasswordResetEmail(email);

  return res
    .status(OK)
    .json({ message: "Password reset email sent successfully" });
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  const { password, verificationCode } = passwordResetSchema.parse(req.body);

  await creatNewPasword(password, verificationCode);

  return clearAuthCookies(res).status(OK).json({
    message: "Password reset successfully.",
  });
};
