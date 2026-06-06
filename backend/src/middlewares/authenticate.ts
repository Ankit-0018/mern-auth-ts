import { RequestHandler } from "express";
import { verifyToken } from "../utils/jwt";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/http";
import { AppErrorCode } from "../constants/appErrorCode";

export const authenticate: RequestHandler = async (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not Authorized",
    AppErrorCode.InvalidAccessToken,
  );

  const { payload, error } = verifyToken(accessToken);

  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token Expired" : "Invalid or expired token",
  );

  req.userId = payload.userId;
  req.sessionId = payload.sessionId;

  next();
};
