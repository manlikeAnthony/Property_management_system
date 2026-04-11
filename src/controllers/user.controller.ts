import User from "../models/user.model";
import { HttpCodes } from "../errors/HttpCodes";
import { AppCodes } from "../errors/AppCodes";
import { CustomError } from "../errors/CustomError";
import { successResponse } from "../response";
import { checkPermissions } from "../utils";
import { Request, Response } from "express";
import {
  getAllAdminsService,
  getCurrentUserService,
  getAllUsersService,
  getSingleUserService,
} from "../services/user.service";
import type {Params} from "../types/auth.types";

export const getAllUsers = async (_req: Request, res: Response) => {
  const everyOne = await getAllUsersService();

  res.status(200).json(
    successResponse({
      message: "All Users Fetched Successfully",
      data: everyOne,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const getAllAdmins = async (_req: Request, res: Response) => {
  
  const admins = await getAllAdminsService();

  res.status(200).json(
    successResponse({
      message: "All Admins Fetched Successfully",
      data: admins,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await getCurrentUserService((req as any).user.userId);

  res.status(HttpCodes.OK).json(
    successResponse({
      message: "User Fetched Successfully",
      data: user,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const getSingleUser = async (req: Request<Params>, res: Response) => {
  const { id: userId } = req.params;

  const user = await getSingleUserService(userId);

  checkPermissions(req.user, user._id);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "User Fetched Successfully",
      data: user,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const deleteUser = async (req: Request<Params>, res: Response) => {
  const { id: userId } = req.params;
  
  const user = await getSingleUserService(userId);

  checkPermissions(req.user, user._id);

  await user.deleteOne();

  res.status(HttpCodes.OK).json(
    successResponse({
      message: "User Fetched Successfully",
      data: user,
      code: AppCodes.SUCCESS,
    }),
  );
};
