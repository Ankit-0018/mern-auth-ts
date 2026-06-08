import { RequestHandler } from "express";
import { verifyToken } from "../utils/jwt";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/http";
import { AppErrorCode } from "../constants/appErrorCode";
import sessionModel from "../models/session.model";

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

  const session = await sessionModel.findById(payload.sessionId);

  appAssert(session, UNAUTHORIZED, "Session expired or revoked");

  req.userId = payload.userId;
  req.sessionId = payload.sessionId;

  next();
};
