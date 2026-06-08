import { RequestHandler } from "express";
import sessionModel from "../models/session.model";
import { NOT_FOUND, OK } from "../constants/http";
import z from "zod";
import appAssert from "../utils/appAssert";

export const getSessionsHandler: RequestHandler = async (req, res) => {
  const userId = req.userId;
  const sessions = await sessionModel.find(
    {
      userId,
      expiresAt: { $gt: new Date() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },
    {
      sort: { createdAt: -1 },
    },
  );

  const sessionObj = sessions.map((session) => {
    return {
      ...session.toObject(),
      ...(session._id === userId && {
        isCurrent: true,
      }),
    };
  });

  return res.status(OK).json(sessionObj);
};

export const deleteSessionHandler: RequestHandler = async (req, res) => {
  const sessionId = z.string().parse(req.params.id);
  const deleted = await sessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });

  appAssert(deleted, NOT_FOUND, "Session not found.");
  return res.status(OK).json({
    message: "Session deleted Successfully.",
  });
};
