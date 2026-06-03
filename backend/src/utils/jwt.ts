import { JWT_SECRET, JWT_REFRESH_SECRET } from "../constants/env";
import { sessionDocument } from "../models/session.model";
import { UserDocument } from "../models/user.model";
import { SignOptions, VerifyOptions } from "jsonwebtoken";
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

const defaults: SignOptions = {
  audience: ["user"],
};

const verifyDefaults: VerifyOptions = {
  audience: "user",
};

const accessTokenSignOptions: SignOptionsAndSecret = {
  ...defaults,
  expiresIn: "15m",
  secret: JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  ...defaults,
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret,
) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...signOpts,
  });
};

type VerifyOptionsAndSecret = VerifyOptions & {
  secret: string;
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptionsAndSecret,
) => {
  try {
    const { secret = JWT_SECRET, ...verifyOpts } = options || {};
    const payload = jwt.verify(token, secret, {
      ...verifyDefaults,
      ...verifyOpts,
    }) as TPayload;
    return { payload };
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
};
