import Property from "../models/property.model";
import Tenancy from "../models/tenancy.model";
import { CustomError } from "../errors/CustomError";
import { HttpCodes } from "../errors/HttpCodes";
import { AppCodes } from "../errors/AppCodes";
import mongoose from "mongoose";
import { getActiveTenancyFilter } from "../utils/tenancy.utils";
import { computePropertyStatus } from "../utils/property.utils";
import { TenancyQuery } from "../query/tenancy/tenancy.query";

export const createTenancyService = async (
  propertyId: string,
  tenantId: string,
  startDate: Date,
  endDate?: Date,
) => {
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
      ...getActiveTenancyFilter(),
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

    const tenancy = await Tenancy.create(
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
    const status = await computePropertyStatus(propertyId, session);

    await Property.findByIdAndUpdate(
      propertyId,
      { status: status },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
    return tenancy;
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const terminateTenancyService = async (
  tenancyId: string,
  requestUser: any,
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const tenancy = await Tenancy.findById(tenancyId).session(session);
    if (!tenancy) {
      CustomError.throwError(
        HttpCodes.NOT_FOUND,
        AppCodes.RESOURCE_NOT_FOUND,
        "Tenancy not found",
      );
    }

    if (
      requestUser.userId !== tenancy.landlord.toString() &&
      requestUser.userId !== tenancy.tenant.toString() &&
      !requestUser.roles.includes("ADMIN")
    ) {
      CustomError.throwError(
        HttpCodes.UNAUTHORIZED,
        AppCodes.AUTH_UNAUTHORIZED,
        "Not authorized to terminate this tenancy",
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
    await tenancy.save({ session });

    const status = await computePropertyStatus(
      tenancy.property.toString(),
      session,
    );

    await Property.findByIdAndUpdate(
      tenancy.property,
      { status: status },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getActiveTenanciesByPropertyService = async (
  propertyId: string,
  query: TenancyQuery,
) => {
  const { pagination, sort } = query;

  const tenancies = await Tenancy.find({
    property: propertyId,
    ...getActiveTenancyFilter(),
  })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort({ [sort.field]: sort.order })
    .populate("tenant", "name email");

  return tenancies;
};

export const getUserTenanciesService = async (
  userId: string,
  query: TenancyQuery,
) => {
  const { pagination, sort } = query;

  const tenancies = await Tenancy.find({
    tenant: userId,
    ...getActiveTenancyFilter(),
  })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort({ [sort.field]: sort.order })
    .populate("property", "title location price");

  return tenancies;
};

export const getLandlordTenanciesService = async (
  landlordId: string,
  query: TenancyQuery,
) => {
  const { pagination, sort } = query;

  const tenancies = await Tenancy.find({
    landlord: landlordId,
    ...getActiveTenancyFilter(),
  })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort({ [sort.field]: sort.order })
    .populate("property", "title location price")
    .populate("tenant", "name email");

  return tenancies;
};

export const getTenancyByIdService = async (tenancyId: string) => {
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

export const getAllTenanciesService = async (query: TenancyQuery) => {
  const { pagination, sort } = query;

  const tenancies = await Tenancy.find()
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort({ [sort.field]: sort.order })
    .populate("property", "title location price")
    .populate("tenant", "name email")
    .populate("landlord", "name email");

  return tenancies;
};
