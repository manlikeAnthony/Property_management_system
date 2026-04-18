import User from "../models/user.model";
import { HttpCodes } from "../errors/HttpCodes";
import { AppCodes } from "../errors/AppCodes";
import { CustomError } from "../errors/CustomError";
import { successResponse } from "../response";
import { checkPermissions } from "../utils";
import { Request, Response } from "express";
import {
  becomeLandlordService,
  approveLandlordService,
  rejectLandlordService,
  getAllLandlordsService,
  getAllApprovedLandlordsService,
  getAllLandlordApplicationsService,
  getMyLandlordProfileService,
  getAllRejectedLandlordsService,
  getSingleLandlordService,
  deleteLandlordService,
} from "../services/landlord.service";
import { Params } from "../types/auth.types";
import {parseLandlordQuery} from "../query/landlord/landlord.query";

export const becomeLandlord = async (req: Request, res: Response) => {
  const user = await becomeLandlordService(req.user!.userId);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Landlord application submitted successfully",
      data: user,
      code: AppCodes.LANDLORD_APPLICATION_SUBMITTED,
    }),
  );
};

export const approveLandlord = async (req: Request<Params>, res: Response) => {
  //ADMIN PROTECTED
  const { id: userId } = req.params;
  if (!userId) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.INVALID_INPUT,
      "User ID is required",
    );
  }
  const user = await approveLandlordService(userId);

  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Landlord application approved successfully",
      data: user,
      code: AppCodes.LANDLORD_APPLICATION_APPROVED,
    }),
  );
};

export const rejectLandlord = async (req: Request<Params>, res: Response) => {
  //ADMIN PROTECTED
  const { id: userId } = req.params;

  const user = await rejectLandlordService(userId);

  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Landlord application rejected successfully",
      data: user,
      code: AppCodes.LANDLORD_APPLICATION_REJECTED,
    }),
  );
};

export const getMyLandlordProfile = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = await getMyLandlordProfileService(userId);

  checkPermissions(req.user, user._id);

  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Landlord profile retrieved successfully",
      data: user,
      code: AppCodes.LANDLORD_PROFILE_RETRIEVED,
    }),
  );
};

export const getAllLandlords = async (req: Request, res: Response) => {
  const query = parseLandlordQuery(req);
  const landlords = await getAllLandlordsService(query);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Landlords retrieved successfully",
      data: landlords,
      code: AppCodes.LANDLORDS_RETRIEVED,
    }),
  );
};

export const getAllLandlordApplications = async (req: Request, res: Response) => {
  const query = parseLandlordQuery(req);
  const applications = await getAllLandlordApplicationsService(query);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Landlord applications retrieved successfully",
      data: applications,
      code: AppCodes.LANDLORD_APPLICATIONS_RETRIEVED,
    }),
  );
};

export const getAllApprovedLandlords = async (req: Request, res: Response) => {
  const query = parseLandlordQuery(req);
  const approvedLandlords = await getAllApprovedLandlordsService(query);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Approved landlords retrieved successfully",
      data: approvedLandlords,
      code: AppCodes.LANDLORDS_RETRIEVED,
    }),
  );
};

export const getAllRejectedLandlords = async (req: Request, res: Response) => {
  const query = parseLandlordQuery(req);
  const rejectedLandlords = await getAllRejectedLandlordsService(query);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Rejected landlords retrieved successfully",
      data: rejectedLandlords,
      code: AppCodes.LANDLORDS_RETRIEVED,
    }),
  );
};

export const getSingleLandlord = async (
  req: Request<Params>,
  res: Response,
) => {
  const { id: userId } = req.params;
  const landlord = await getSingleLandlordService(userId);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Landlord retrieved successfully",
      data: landlord,
      code: AppCodes.LANDLORD_PROFILE_RETRIEVED,
    }),
  );
};

export const deleteLandlord = async (req: Request<Params>, res: Response) => {
  const { id: userId } = req.params;

  const user = await deleteLandlordService(userId);

  if (!user.landlordProfile) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.LANDLORD_NOT_FOUND,
      "Landlord profile not found",
    );
  }

  user.landlordProfile.isActiveLandlord = false;
  user.landlordProfile.deactivatedAt = new Date();
  user.save();

  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Landlord deleted successfully",
      data: user,
      code: AppCodes.USER_DELETED,
    }),
  );
};
