import Ownership from "../models/ownership.model";
import { CustomError } from "../errors/CustomError";
import { HttpCodes } from "../errors/HttpCodes";
import { AppCodes } from "../errors/AppCodes";
import mongoose from "mongoose";
import Property from "../models/property.model";
import Transaction from "../models/transaction.model";

export const purchasePropertyService = async (
  propertyId: string,
  buyerId: string,
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
    if (property.status !== "AVAILABLE") {
      CustomError.throwError(
        HttpCodes.BAD_REQUEST,
        AppCodes.OWNERSHIP_TRANSFER_NOT_ALLOWED,
        "Property is not available for purchase",
      );
    }

    if (property.type !== "SALE") {
      CustomError.throwError(
        HttpCodes.BAD_REQUEST,
        AppCodes.OWNERSHIP_TRANSFER_NOT_ALLOWED,
        "Property is not available for purchase",
      );
    }

    const sellerOwnership = await Ownership.findOne({
      property: propertyId,
      disposedAt: null,
    }).session(session);

    if (!sellerOwnership) {
      CustomError.throwError(
        HttpCodes.NOT_FOUND,
        AppCodes.OWNERSHIP_NOT_FOUND,
        "No active ownership found for this property",
      );
    }

    await transferOwnershipCore(propertyId, buyerId, session);

    await Property.findByIdAndUpdate(
      propertyId,
      { owner: buyerId, status: "SOLD" },
      { session },
    );

    await Transaction.create(
      [
        {
          property: propertyId,
          buyer: buyerId,
          seller: sellerOwnership.owner,
          amount: property.price,
          type: "SALE",
        },
      ],
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
export const initializeOwnershipService = async (
  propertyId: string,
  userId: string,
  session?: any,
) => {
  const existingOwnership = await Ownership.findOne({
    property: propertyId,
  }).session(session);

  if (existingOwnership) {
    CustomError.throwError(
      HttpCodes.CONFLICT,
      AppCodes.OWNERSHIP_ALREADY_EXISTS,
      "Ownership record already exists for this property",
    );
  }

  await Ownership.create(
    [
      {
        property: propertyId,
        owner: userId,
        acquiredAt: new Date(),
      },
    ],
    { session },
  );
};

export const transferOwnershipCore = async (
  propertyId: string,
  newOwnerId: string,
  session?: any,
): Promise<void> => {
  const currentOwnership = await Ownership.findOne({
    property: propertyId,
    disposedAt: null,
  }).session(session);

  if (!currentOwnership) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.OWNERSHIP_NOT_FOUND,
      "No active Ownership found",
    );
  }

  currentOwnership.disposedAt = new Date();
  await currentOwnership.save({ session });

  await Ownership.create(
    [
      {
        property: propertyId,
        owner: newOwnerId,
        acquiredAt: new Date(),
      },
    ],
    { session },
  );

  await Property.findByIdAndUpdate(
    propertyId,
    { owner: newOwnerId },
    { session },
  );
};

export const transferOwnershipService = async (
  propertyId: string,
  newOwnerId: string,
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await transferOwnershipCore(propertyId, newOwnerId, session);

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getOwnershipHistoryService = async (propertyId: string) => {
  const ownershipHistory = await Ownership.find({ property: propertyId })
    .sort({ acquiredAt: -1 })
    .populate({ path: "owner", select: "name email" });
  return ownershipHistory;
};

export const getCurrentOwnerService = async (propertyId: string) => {
  return Ownership.findOne({ property: propertyId, disposedAt: null }).populate(
    { path: "owner", select: "name email" },
  );
};

export const getActiveOwnership = async (propertyId: string) => {
  return Ownership.findOne({ property: propertyId, disposedAt: null });
};

export const assertSingleActiveOwnership = async (propertyId: string) => {
  const activeOwnerships = await Ownership.find({
    property: propertyId,
    disposedAt: null,
  });
  if (activeOwnerships.length > 1) {
    CustomError.throwError(
      HttpCodes.INTERNAL_SERVER_ERROR,
      AppCodes.OWNERSHIP_DATA_INCONSISTENCY,
      "Data inconsistency: Multiple active ownership records found for the same property",
    );
  }
  return activeOwnerships[0] || null;
};
