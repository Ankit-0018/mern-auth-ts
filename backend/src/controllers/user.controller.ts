import { Request, Response } from "express";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import { NOT_FOUND, OK } from "../constants/http";

export const getUserHandler = async (req: Request, res: Response) => {
  const { userId, sessionId } = req;

  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, "User not found.");

  res.status(OK).json({
    user: user.omitPassword(),
  });
};
