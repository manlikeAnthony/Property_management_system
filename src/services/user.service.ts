import { AppCodes } from "../errors/AppCodes";
import { CustomError } from "../errors/CustomError";
import { HttpCodes } from "../errors/HttpCodes";
import User from "../models/user.model";
import { checkPermissions } from "../utils";

export const getAllUsersService = async () => {
  const users = await User.find({}).select("-password");

  if (users.length === 0) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.USER_NOT_FOUND,
      "No Users found",
    );
  }
  return users;
};

export const getAllAdminsService = async () => {
  const admins = await User.find({ roles: "ADMIN" }).select("-password");
  if (admins.length === 0) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.USER_NOT_FOUND,
      "No Admins found",
    );
  }
  return admins;
};

export const getCurrentUserService = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.USER_NOT_FOUND,
      "User not found",
    );
  }

  return user;
};

export const getSingleUserService = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.USER_NOT_FOUND,
      "User not found",
    );
  }
  return user;
};


