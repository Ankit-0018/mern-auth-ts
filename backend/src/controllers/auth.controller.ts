import { Request, Response } from "express";
import catchErros from "../utils/catchErrors";
import z from "zod";
import { OK } from "../constants/http";

const registerSchema = z.object({
  email: z.string().email().min(5).max(255),
  password: z.string().min(6).max(1024),
  confirmPassword: z.string().min(6).max(1024),
  userAgent: z.string().optional()
}).refine(
  ({ password, confirmPassword }) => password === confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
)

export const registerHandler = catchErros(
    async (req : Request , res : Response) => {
        const request = registerSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"]

        })

        res.status(OK).json({
          message : "success parsing",
          request
        })
    }
)