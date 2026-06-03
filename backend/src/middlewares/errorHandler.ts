import { ErrorRequestHandler, Response } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/http";
import { z } from "zod";
import { AppError } from "../utils/AppError";
import { clearAuthCookies, REFRESH_PATH } from "../utils/cookies";
const handleZodError = (res: Response, errors: z.ZodError) => {
  const error = errors.issues.map((issue) => {
    return {
      path: issue.path.join("."),
      message: issue.message,
    };
  });
  res.status(400).json({
    message: "Bad Request",
    error,
  });
};

const handleAppError = (res: Response, error: AppError) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof z.ZodError) {
    return handleZodError(res, err);
  }

  if (err.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }

  if (err instanceof AppError) {
    return handleAppError(res, err);
  }
  console.log(`PATH: ${req.path} -- ERROR: ${err}`);
  return res.status(INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
  });
};

export default errorHandler;
