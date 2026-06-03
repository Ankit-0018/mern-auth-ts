import { JWT_SECRET, JWT_REFRESH_SECRET } from "../constants/env";
import { sessionDocument } from "../models/session.model";
import { UserDocument } from "../models/user.model";
import { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export type RefreshTokenPayload = {
  sessionId: sessionDocument["_id"];
};

export type AccessTokenPayload = {
  sessionId: sessionDocument["_id"];
  userId: UserDocument["_id"];
};

export type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

const defaultSignOptions: SignOptions = {
  audience: ["user"],
};
const accessTokenSignOptions: SignOptionsAndSecret = {
  ...defaultSignOptions,
  expiresIn: "15m",
  secret: JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  ...defaultSignOptions,
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret,
) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaultSignOptions,
    ...signOpts,
  });
};
