import Property from "../models/property.model";
import Tenancy from "../models/tenancy.model";
import { CustomError } from "../errors/CustomError";
import { HttpCodes } from "../errors/HttpCodes";
import { AppCodes } from "../errors/AppCodes";
import mongoose from "mongoose";

export const createTenancyService = async (
  propertyId: string,
  tenantId: string,
  startDate: Date,
  endDate?: Date,
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const property = await Property.findById(propertyId).session(session);

    if (!property) {
      CustomError.throwError(
        HttpCodes.NOT_FOUND,
        AppCodes.PROPERTY_NOT_FOUND,
        "Property not found",
      );
    }

    if (property.type !== "RENT") {
      CustomError.throwError(
        HttpCodes.BAD_REQUEST,
        AppCodes.TENANCY_CREATION_NOT_ALLOWED,
        "Tenancy can only be created for properties available for rent",
      );
    }
    if (property.status === "SOLD") {
      CustomError.throwError(
        HttpCodes.BAD_REQUEST,
        AppCodes.TENANCY_CREATION_NOT_ALLOWED,
        "Tenancy cannot be created for properties that are sold",
      );
    }
    if (property.owner.toString() === tenantId) {
      CustomError.throwError(
        HttpCodes.BAD_REQUEST,
        AppCodes.TENANCY_CREATION_NOT_ALLOWED,
        "Owner cannot be a tenant of their own property",
      );
    }

    const activeTenanciesCount = await Tenancy.countDocuments({
      property: propertyId,
      status: "ACTIVE",
      endDate: { $gt: new Date() }, // Count only active tenancies
    }).session(session);

    if (activeTenanciesCount >= property.maxTenants) {
      CustomError.throwError(
        HttpCodes.BAD_REQUEST,
        AppCodes.TENANCY_CREATION_NOT_ALLOWED,
        "Maximum number of active tenancies for this property has been reached",
      );
    }

    const existingTenancy = await Tenancy.findOne({
      property: propertyId,
      tenant: tenantId,
      status: "ACTIVE",
    }).session(session);

    if (existingTenancy) {
      CustomError.throwError(
        HttpCodes.BAD_REQUEST,
        AppCodes.TENANCY_CREATION_NOT_ALLOWED,
        "Tenant already has an active tenancy for this property",
      );
    }

    await Tenancy.create(
      [
        {
          property: propertyId,
          tenant: tenantId,
          landlord: property.owner,
          rentAmount: property.price,
          startDate,
          endDate,
          status: "ACTIVE",
        },
      ],
      { session },
    );
    const newTenantCount = activeTenanciesCount + 1;

    const newStatus =
      newTenantCount >= property.maxTenants ? "RENTED" : "AVAILABLE";

    await Property.findByIdAndUpdate(
      propertyId,
      { status: newStatus },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const terminateTenancyService = async (
  tenancyId: string,
): Promise<void> => {
  const tenancy = await Tenancy.findById(tenancyId);

  if (!tenancy) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.RESOURCE_NOT_FOUND,
      "Tenancy not found",
    );
  }

  if (tenancy.status !== "ACTIVE") {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.TENANCY_CREATION_NOT_ALLOWED,
      "Tenancy is not active and cannot be terminated",
    );
  }

  tenancy.status = "TERMINATED";
  tenancy.endDate = new Date();
  await tenancy.save();

  // await Property.findByIdAndUpdate(tenancy.property, { status: "AVAILABLE" });
};

export const getActiveTenanciesByPropertyService = async (
  propertyId: string,
) => {
  const tenancies = await Tenancy.find({
    property: propertyId,
    status: "ACTIVE",
    $or : [
      { endDate : {$exists: false} },
      { endDate : {$gt: new Date()} }
    ]
  }).populate("tenant", "name email");
  return tenancies;
};

export const getUserTenanciesService = async (
  userId: string,
) => {
  const tenancies = await Tenancy.find({
    tenant: userId,
    status: "ACTIVE",
    $or : [
      { endDate : {$exists: false} },
      { endDate : {$gt: new Date()} }
    ]
  }).populate("property", "title location price");
  return tenancies;
};

export const getLandlordTenanciesService = async (
  landlordId: string,
) => {
  const tenancies = await Tenancy.find({
    landlord: landlordId,
    status: "ACTIVE",
    $or : [
      { endDate : {$exists: false} },
      { endDate : {$gt: new Date()} }
    ]
  })
    .populate("property", "title location price")
    .populate("tenant", "name email");
  return tenancies;
};

export const getTenancyByIdService = async (
  tenancyId: string,
)=> {
  const tenancy = await Tenancy.findById(tenancyId)
    .populate("property", "title location price")
    .populate("tenant", "name email")
    .populate("landlord", "name email");

  if (!tenancy) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.RESOURCE_NOT_FOUND,
      "Tenancy not found",
    );
  }

  return tenancy;
};

export const getAllTenanciesService = async () => {
  const tenancies = await Tenancy.find()
    .populate("property", "title location price")
    .populate("tenant", "name email")
    .populate("landlord", "name email");
  return tenancies;
};