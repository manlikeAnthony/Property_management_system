import { Request, Response } from "express";
import crypto from "crypto";

import User from "../models/user.model";
import Token, { TokenDocument } from "../models/token.model";
import { attachCookiesToResponse, createTokenUser } from "../utils";

import { CustomError } from "../errors/CustomError";
import { AppCodes } from "../errors/AppCodes";
import { HttpCodes } from "../errors/HttpCodes";
import { successResponse } from "../response";
import {
  registerService,
  loginService,
  logoutService,
  verifyEmailService,
  resendVerificationEmailService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/auth.service";

import { sendVerificationEmail, sendResetPasswordEmail } from "../utils/email";

export const register = async (req: Request, res: Response) => {
  const { user, verificationToken } = await registerService(req.body);

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: verificationToken,
    origin: "http://localhost:3000",
  });

  res.status(HttpCodes.CREATED).json(
    successResponse({
      message: "User registered successfully",
      data: null,
      code: AppCodes.USER_CREATED,
    }),
  );
};

export const login = async (req: Request, res: Response) => {
  const { tokenUser, refreshToken } = await loginService(req.body, {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(HttpCodes.OK).json(
    successResponse({
      message: "User logged in successfully",
      data: tokenUser,
      code: AppCodes.AUTH_LOGIN_SUCCESS,
    }),
  );
};

export const logout = async (req: Request, res: Response) => {
  await logoutService(req.user?.userId);

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(0),
  };

  res.cookie("accessToken", "logout", cookieOptions);
  res.cookie("refreshToken", "logout", cookieOptions);

  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Logged out successfully",
      data: null,
      code: AppCodes.AUTH_LOGOUT_SUCCESS,
    }),
  );
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token, email } = req.body;
  if (!token || !email) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.MISSING_REQUIRED_FIELD,
      "missing required input",
    );
  }
  const user = await verifyEmailService(token, email);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Email verified successfully",
      data: user,
      code: AppCodes.USER_VERIFIED,
    }),
  );
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.MISSING_REQUIRED_FIELD,
      "missing required input",
    );
  }
  const user = await resendVerificationEmailService(email);

  if (user) {
    await sendVerificationEmail({
      name: user.name,
      email: user.email,
      verificationToken: user.verificationToken,
      origin: "http://localhost:3000",
    });
  }

  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Verification email sent successfully",
      data: user,
      code: AppCodes.AUTH_VERIFICATION_EMAIL_SENT,
    }),
  );
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.MISSING_REQUIRED_FIELD,
      "Email is required",
    );
  }

  const user = await forgotPasswordService(email);
  if (user) {
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: user.passwordToken,
      origin: "http://localhost:3000",
    });
  }
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Password reset email sent successfully",
      data: null,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, token, password } = req.body;
  if (!email || !token || !password) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.MISSING_REQUIRED_FIELD,
      "Email, token, and new password are required",
    );
  }
  await resetPasswordService({ email, token, password });
  
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Password reset successfully",
      data: null,
      code: AppCodes.AUTH_PASSWORD_RESET_SUCCESS,
    }),
  );
};
