import { AppCodes } from "../errors/AppCodes";
import { CustomError } from "../errors/CustomError";
import { HttpCodes } from "../errors/HttpCodes";
import User from "../models/user.model";
import { checkPermissions } from "../utils";
import {LandlordQuery} from "../query/landlord/landlord.query";

export const becomeLandlordService = async (userId: string) => {
  if (!userId) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.INVALID_INPUT,
      "User ID is required"
    );
  }
  const user = await User.findById(userId).select("-password");

  if (!user) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.USER_NOT_FOUND,
      "User not found",
    );
  }
  if (user.roles.includes("LANDLORD")) {
    CustomError.throwError(
      HttpCodes.CONFLICT,
      AppCodes.LANDLORD_ALREADY_EXISTS,
      "User is already a landlord",
    );
  }
  user.roles.push("LANDLORD");
  user.landlordProfile = {
    applicationStatus: "PENDING",
  };

  await user.save();
  return user;
};

export const approveLandlordService = async (userId: string) => {

  if(!userId) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.INVALID_INPUT,
      "User ID is required"
    );
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.USER_NOT_FOUND,
      "User not found",
    );
  }
  if (!user.roles.includes("LANDLORD") || !user.landlordProfile) {
    CustomError.throwError(
      HttpCodes.CONFLICT,
      AppCodes.LANDLORD_NOT_FOUND,
      "User is not a landlord",
    );
  }

  if(user.landlordProfile.applicationStatus === "REJECTED"){
    CustomError.throwError(
      HttpCodes.CONFLICT,
      AppCodes.LANDLORD_ALREADY_REJECTED,
      "Landlord application is already rejected and cannot be approved"
    );
  }

    if(user.landlordProfile.applicationStatus === "APPROVED"){
      CustomError.throwError(
        HttpCodes.CONFLICT,
        AppCodes.LANDLORD_ALREADY_APPROVED,
        "Landlord application is already approved"
      )
    }

  user.landlordProfile.applicationStatus = "APPROVED";
  user.landlordProfile.isActiveLandlord = true;
  user.landlordProfile.approvedAt = new Date();
  await user.save();
  return user;
};

export const rejectLandlordService = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.USER_NOT_FOUND,
      "User not found",
    );
  }
  if (!user.roles.includes("LANDLORD") || !user.landlordProfile) {
    CustomError.throwError(
      HttpCodes.CONFLICT,
      AppCodes.LANDLORD_NOT_FOUND,
      "User is not a landlord",
    );
  }

  if(user.landlordProfile.applicationStatus === "APPROVED"){
    CustomError.throwError(
      HttpCodes.CONFLICT,
      AppCodes.LANDLORD_ALREADY_APPROVED,
      "Landlord application is already approved and cannot be rejected"
    );
    
  }
  user.landlordProfile.applicationStatus = "REJECTED";
  user.landlordProfile.rejectedAt = new Date();
  await user.save();
  return user;
};

export const getAllLandlordsService = async (query: LandlordQuery) => {
  const { filters, pagination, sort } = query;

  const mongoQuery: any = {
    roles: "LANDLORD",
  };

  if (filters.status) {
    mongoQuery["landlordProfile.applicationStatus"] = filters.status;
  }

  if (filters.search) {
    mongoQuery.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
    ];
  }

  const landlords = await User.find(mongoQuery)
    .select("-password")
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort({ [sort.field]: sort.order });

  return landlords;
};

export const getAllLandlordApplicationsService = async (query: LandlordQuery) => {
  const applications = await User.find({
    "landlordProfile.applicationStatus": "PENDING",
    roles: "LANDLORD",
  })
    .select("-password")
    .skip(query.pagination.skip)
    .limit(query.pagination.limit)
    .sort({ [query.sort.field]: query.sort.order });

  return applications;
};

export const getAllApprovedLandlordsService = async (query: LandlordQuery) => {
  const approvedLandlords = await User.find({
    "landlordProfile.applicationStatus": "APPROVED",
    roles: "LANDLORD",
  })
    .select("-password")
    .skip(query.pagination.skip)
    .limit(query.pagination.limit)
    .sort({ [query.sort.field]: query.sort.order });

  return approvedLandlords;
};

export const getAllRejectedLandlordsService = async (query: LandlordQuery) => {
  const rejectedLandlords = await User.find({
    "landlordProfile.applicationStatus": "REJECTED",
    roles: "LANDLORD",
  })
    .select("-password")
    .skip(query.pagination.skip)
    .limit(query.pagination.limit)
    .sort({ [query.sort.field]: query.sort.order });

  return rejectedLandlords;
}

export const getMyLandlordProfileService = async (userId: string) => {
  const landlord = await User.findById(userId).select("-password");
  if (!landlord || !landlord.roles.includes("LANDLORD")) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.LANDLORD_NOT_FOUND,
      "Landlord not found",
    );
  }
  return landlord;
};


export const getSingleLandlordService = async (userId: string) => {
  const landlord = await User.findById(userId).select("-password");

  if (!landlord || !landlord.roles.includes("LANDLORD")) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.LANDLORD_NOT_FOUND,
      "Landlord not found",
    );
  }
  return landlord;  
};

export const deleteLandlordService = async (requestUser : any) => {

  const user = await User.findById(requestUser.userId).select("-password");

  if (!user) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.USER_NOT_FOUND,
      "User not found"
    );
  }

  if (!user.roles.includes("LANDLORD")) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.LANDLORD_NOT_FOUND,
      "Landlord not found"
    );
  }
    if (!user.landlordProfile) {
      CustomError.throwError(
        HttpCodes.NOT_FOUND,
        AppCodes.LANDLORD_NOT_FOUND,
        "Landlord profile not found",
      );
    }
  
    checkPermissions(requestUser, user._id);
    
    user.landlordProfile.isActiveLandlord = false;
    user.landlordProfile.deactivatedAt = new Date();
    user.save();

  return user;
};