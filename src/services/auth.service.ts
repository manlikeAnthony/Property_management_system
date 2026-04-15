import Token from "../models/token.model";
import { AppCodes } from "../errors/AppCodes";
import { CustomError } from "../errors/CustomError";
import { HttpCodes } from "../errors/HttpCodes";
import User from "../models/user.model";
import crypto from "crypto";
import { createTokenUser } from "../utils";
import { TokenDocument } from "../models/token.model";
import type {
  ResendVerificationEmailResponse,
  ForgotPasswordResponse,
  ResetPasswordPayload,
} from "../types/auth.types";
import { CustomLogger } from "../logger/CustomLogger";

export const registerService = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.MISSING_REQUIRED_FIELD,
      "Missing required fields",
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.USER_ALREADY_EXISTS,
      "Email already in use",
    );
  }

  const isFirstAccount = (await User.countDocuments()) === 0;

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    roles: isFirstAccount ? ["ADMIN"] : ["USER"],
    isVerified: false,
    verificationToken,
  });

  return { user, verificationToken };
};

export const loginService = async (
  data: { email: string; password: string },
  meta: { ip?: string; userAgent?: string },
) => {
  const { email, password } = data;

  if (!email || !password) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.MISSING_REQUIRED_FIELD,
      "Missing required fields",
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    CustomError.throwError(
      HttpCodes.UNAUTHORIZED,
      AppCodes.AUTH_INVALID_CREDENTIALS,
      "Invalid credentials",
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    CustomError.throwError(
      HttpCodes.UNAUTHORIZED,
      AppCodes.AUTH_INVALID_CREDENTIALS,
      "Invalid credentials",
    );
  }

  if (!user.isVerified) {
    CustomError.throwError(
      HttpCodes.UNAUTHORIZED,
      AppCodes.AUTH_UNAUTHORIZED,
      "Account not verified",
    );
  }

  const tokenUser = createTokenUser(user);

  let refreshToken = "";

  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    if (!existingToken.isValid) {
      CustomError.throwError(
        HttpCodes.UNAUTHORIZED,
        AppCodes.AUTH_UNAUTHORIZED,
        "Invalid credentials",
      );
    }

    refreshToken = existingToken.refreshToken;
  } else {
    refreshToken = crypto.randomBytes(40).toString("hex");

    const tokenPayload: Partial<TokenDocument> = {
      user: user._id,
      refreshToken,
      ip: meta.ip,
      userAgent: meta.userAgent,
    };

    await Token.create(tokenPayload);
  }

  return { tokenUser, refreshToken };
};

export const logoutService = async (userId?: string) => {
  if (userId) {
    await Token.deleteMany({ user: userId });
  }
};

export const verifyEmailService = async (token: string, email: string) => {
  if (!token || !email) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.MISSING_REQUIRED_FIELD,
      "missing required input",
    );
  }
  const user = await User.findOne({ email }).select("-password");
  if (!user) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.USER_NOT_FOUND,
      "User not found",
    );
  }

  if (user.isVerified) {
    CustomError.throwError(
      HttpCodes.CONFLICT,
      AppCodes.USER_ALREADY_VERIFIED,
      "user already verified",
    ); // im not sure about thhis because i wanted to res this but im not sure what to do
  }

  if (user.verificationToken !== token) {
    CustomError.throwError(
      HttpCodes.UNAUTHORIZED,
      AppCodes.AUTH_UNAUTHORIZED,
      "invalid verification token",
    );
  }
  user.isVerified = true;
  user.verificationToken = "";
  user.verifiedAt = new Date();

  await user.save();

  return user;
};

export const resendVerificationEmailService = async (
  email: string,
): Promise<ResendVerificationEmailResponse> => {
  const user = await User.findOne({ email });
  if (!user) {
    CustomLogger.info(
      "resendVerificationEmailService",
      AppCodes.RESEND_VERIFICATION_EMAIL_NON_EXISTENT_EMAIL,
      { message: `Resend verification email requested for non-existent email: ${email}` },
    );
    return undefined; // Don't reveal that the email doesn't exist
  }

  if (user.isVerified) {
    CustomLogger.info(
      "resendVerificationEmailService",
      AppCodes.USER_ALREADY_VERIFIED,
      { message: `Resend verification email requested for already verified email: ${email}` },
    );
    CustomError.throwError(
      HttpCodes.CONFLICT,
      AppCodes.USER_ALREADY_VERIFIED,
      "User already verified",
    );
  }
  user.verificationToken = crypto.randomBytes(40).toString("hex");

  await user.save();
  return {
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
  };
};

export const forgotPasswordService = async (
  email: string,
): Promise<ForgotPasswordResponse> => {
  const user = await User.findOne({ email });
  if (!user) {
    CustomLogger.info(
      "forgotPasswordService",
      AppCodes.PASSWORD_RESET_ATTEMPT_NON_EXISTENT_EMAIL,
      { message: `Password reset requested for non-existent email: ${email}` },
    );
    return undefined; // Don't reveal that the email doesn't exist
  }

  const passwordToken = crypto.randomBytes(70).toString("hex");

  user.passwordToken = crypto
    .createHash("sha256")
    .update(passwordToken)
    .digest("hex");

  user.passwordTokenExpirationDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await user.save();

  return {
    name: user.name,
    email: user.email,
    passwordToken: passwordToken,
  };
};

export const resetPasswordService = async ({
  email,
  token,
  password,
}: ResetPasswordPayload): Promise<void> => {
  const user = await User.findOne({ email });
  if (!user) {
    CustomLogger.info(
      "resetPasswordService",
      AppCodes.PASSWORD_RESET_ATTEMPT_NON_EXISTENT_EMAIL,
      { message: `Password reset attempted for non-existent email: ${email}` },
    );
    return undefined; // Don't reveal that the email doesn't exist
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const currentDate = new Date();

  const isValidToken =
    user.passwordToken === hashedToken &&
    user.passwordTokenExpirationDate &&
    user.passwordTokenExpirationDate > currentDate;

  if (!isValidToken) {
    CustomLogger.info(
      "resetPasswordService",
      AppCodes.PASSWORD_RESET_ATTEMPT_INVALID_TOKEN,
      {
        message: `Password reset attempted with invalid or expired token for email: ${email}`,
      },
    );
    return undefined; // Don't reveal that the token is invalid or expired
  }
  user.password = password;
  user.passwordToken = undefined;
  user.passwordTokenExpirationDate = undefined;
  await user.save();
};
