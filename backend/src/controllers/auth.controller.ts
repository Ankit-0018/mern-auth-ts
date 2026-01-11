import { Request, Response } from "express";
import catchErros from "../utils/catchErrors";
import z from "zod";
import { CREATED, OK } from "../constants/http";
import { createAccount } from "../services/auth.service";
import setAuthCookies from "../utils/cookies";

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
        const {user , accessToken , refreshToken} = await createAccount(request);
        
        return setAuthCookies({res , accessToken , refreshToken}).status(CREATED).json(user);
    }
)