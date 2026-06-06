import verificationCodeType from "../constants/verificationCodeTypes";
import sessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import verificationCodeModel from "../models/verificationCode.model";
import {
  fiveMinutesFromNow,
  ONE_DAY_MS,
  oneYearFromNow,
  oneHourFromNow,
  thirtyDaysFromNow,
} from "../utils/date";
import appAssert from "../utils/appAssert";
import {
  CONFLICT,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
} from "../constants/http";
import {
  signToken,
  refreshTokenSignOptions,
  RefreshTokenPayload,
  verifyToken,
} from "../utils/jwt";
import { sendMail } from "../utils/sendMail";
import {
  getVerifyEmailTemplate,
  getPasswordResetTemplate,
} from "../utils/emailTemplate";
import { APP_ORIGIN } from "../constants/env";
import { hashPassword } from "../utils/bcrypt";

export type createAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: createAccountParams) => {
  const existingUser = await UserModel.exists({
    email: data.email,
  });
  appAssert(!existingUser, CONFLICT, "User already exists");

  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });

  const verificationCode = await verificationCodeModel.create({
    userId: user._id,
    type: verificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;
  const { error } = await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });

  if (error) {
    console.error("Failed to send verification email", error);
  }

  const session = await sessionModel.create({
    userId: user._id,
    userAgent: data.userAgent ?? "unknown",
  });
  const userId = user._id;
  const sessionInfo = {
    sessionId: session._id,
  };

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({
    ...sessionInfo,
    userId,
  });
  return { user: user.omitPassword(), refreshToken, accessToken };
};

export type loginParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: loginParams) => {
  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

  const userId = user._id;

  const session = await sessionModel.create({
    userId,
    userAgent: userAgent ?? "unknown",
  });

  const sessionInfo = {
    sessionId: session._id,
  };

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({
    ...sessionInfo,
    userId,
  });
  return {
    user: user.omitPassword(),
    refreshToken,
    accessToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  const now = Date.now();
  const session = await sessionModel.findById(payload.sessionId);
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session not found",
  );

  const sessionNeedsRefresh = session.expiresAt.getTime() - now < ONE_DAY_MS;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session._id }, refreshTokenSignOptions)
    : refreshToken;
  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });
  return { accessToken, refreshToken: newRefreshToken };
};

export const verifyEmail = async (code: string) => {
  const validCode = await verificationCodeModel.findOne({
    _id: code,
    type: verificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or Expired verification code");
  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    { verified: true },
    { new: true },
  );
  appAssert(
    updatedUser,
    INTERNAL_SERVER_ERROR,
    "Failed to verify email, please try again later",
  );
  await validCode.deleteOne();
  return updatedUser.omitPassword();
};

export const sendPasswordResetEmail = async (email: string) => {
  const user = await UserModel.findOne({ email });
  appAssert(user, NOT_FOUND, "User with given email not found");

  const fiveMinAgo = fiveMinutesFromNow();
  const count = await verificationCodeModel.countDocuments({
    userId: user._id,
    type: verificationCodeType.PasswordReset,
    createdAt: { $gt: fiveMinAgo },
  });

  appAssert(
    count === 0,
    TOO_MANY_REQUESTS,
    "TOO MANY REQUESTS: Please wait before requesting another password reset email",
  );
  const expiresAt = oneHourFromNow();
  const verificationCode = await verificationCodeModel.create({
    userId: user._id,
    type: verificationCodeType.PasswordReset,
    expiresAt,
  });

  const url = `${APP_ORIGIN}/password/reset?code=${verificationCode._id}&exp=${expiresAt.getTime()}`;
  const { data, error } = await sendMail({
    to: user.email,
    ...getPasswordResetTemplate(url),
  });

  appAssert(data?.id, INTERNAL_SERVER_ERROR, `${error?.name} - ${error?.message}`);
  if (error) {
    console.error("Failed to send password reset email", error);
  }

  return {
    url,
    emailId: data.id,
  }

};


export const creatNewPasword = async (newPassword: string, verificationCode: string) => {

    const validCode = await verificationCodeModel.findOne({
      _id: verificationCode,
      type: verificationCodeType.PasswordReset,
      expiresAt: { $gt: new Date() },
    });
    appAssert(validCode, NOT_FOUND, "Invalid or Expired verification code");

    const updatedUser = await UserModel.findByIdAndUpdate(
      validCode.userId,
      { password: await hashPassword(newPassword) },
    );

    appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset the Passoword.")

    await validCode.deleteOne();
    
    await sessionModel.deleteMany();

    return {
      user: updatedUser.omitPassword()
    }

    
}