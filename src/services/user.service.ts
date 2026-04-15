import { AppCodes } from "../errors/AppCodes";
import { CustomError } from "../errors/CustomError";
import { HttpCodes } from "../errors/HttpCodes";
import User from "../models/user.model";
import { checkPermissions } from "../utils";
import { UserQuery } from "../query/user/userQuery";

export const getAllUsersService = async (query: UserQuery) => {
  const { filters, pagination, sort } = query;

  const mongoQuery: any = {};
  if (filters.search) {
    mongoQuery.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
    ];
  }
  if (filters.role) {
    mongoQuery.roles = filters.role;
  }
  if (filters.status) {
    mongoQuery.accountStatus = filters.status;
  }

  const users = await User.find(mongoQuery)
    .select("-password -verificationToken")
    .sort({ [sort.field]: sort.order })
    .skip(pagination.skip)
    .limit(pagination.limit);

  if (users.length === 0) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.USER_NOT_FOUND,
      "No Users found",
    );
  }
  return users;
};

// export const getAllAdminsService = async () => {
//   const admins = await User.find({ roles: "ADMIN" }).select("-password");
//   if (admins.length === 0) {
//     CustomError.throwError(
//       HttpCodes.NOT_FOUND,
//       AppCodes.USER_NOT_FOUND,
//       "No Admins found",
//     );
//   }
//   return admins;
// };

export const getCurrentUserService = async (userId: string) => {
  const user = await User.findById(userId).select(
    "-password -verificationToken",
  );

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
  const user = await User.findById(userId).select(
    "-password -verificationToken",
  );

  if (!user) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.USER_NOT_FOUND,
      "User not found",
    );
  }
  return user;
};
