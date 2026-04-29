import mongoose from "mongoose";
import Property from "../models/property.model";
import Ownership from "../models/ownership.model";
import Tenancy from "../models/tenancy.model";
import { CustomError } from "../errors/CustomError";
import { HttpCodes } from "../errors/HttpCodes";
import { AppCodes } from "../errors/AppCodes";
import User from "../models/user.model";
import { S3StorageService } from "./s3.service";
import { getActiveTenancyFilter } from "../utils/tenancy.utils";
import {
  UpdatePropertyDTO,
  CreatePropertyWithImagesDTO,
} from "../dto/property";
import { PropertyQuery } from "../query/property/propertyQuery";
import { geocodeAddress } from "../utils/geocoder";
import { initializeOwnershipService } from "./ownership.service";
import { checkPermissions } from "../utils";

export const createPropertyService = async (
  data: CreatePropertyWithImagesDTO,
  user: any,
) => {
  const userRecord = await User.findById(user.userId).populate(
    "landlordProfile",
  );

  if (!userRecord) {
    CustomError.throwError(
      HttpCodes.UNAUTHORIZED,
      AppCodes.AUTH_UNAUTHORIZED,
      "User not found",
    );
  }

  if (userRecord.accountStatus !== "ACTIVE") {
    CustomError.throwError(
      HttpCodes.FORBIDDEN,
      AppCodes.USER_INACTIVE,
      "User account is not active",
    );
  }

  const isAdmin = userRecord.roles.includes("ADMIN");

  const isApprovedLandlord =
    userRecord.roles.includes("LANDLORD") &&
    userRecord.landlordProfile?.applicationStatus === "APPROVED";

  if (!isAdmin && !isApprovedLandlord) {
    CustomError.throwError(
      HttpCodes.FORBIDDEN,
      AppCodes.AUTH_UNAUTHORIZED,
      "Not authorized to create property",
    );
  }

  if (!userRecord.accountStatus || userRecord.accountStatus !== "ACTIVE") {
    CustomError.throwError(
      HttpCodes.FORBIDDEN,
      AppCodes.USER_INACTIVE,
      "User account is not active",
    );
  }

  const {
    title,
    description,
    price,
    type,
    address,
    bedrooms,
    bathrooms,
    area,
    images,
  } = data;

  const addressString = `${address.street}, ${address.city}, ${address.state}, ${address.country}`;

  const geo = await geocodeAddress(addressString);

  const location = {
    type: "Point" as const,
    coordinates: [geo.lng, geo.lat],
  };

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const property = await Property.create(
      [
        {
          ...data,
          location,
          formattedAddress: geo.formattedAddress,
          owner: user.userId,
          listedBy: userRecord._id,
          images: images || [],
          isPublished: false,
          status: "AVAILABLE",
        },
      ],
      { session },
    );

    await initializeOwnershipService(
      property[0]._id.toString(),
      user.userId,
      session,
    );

    await session.commitTransaction();
    session.endSession();

    return property[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getAllPropertiesService = async (query: PropertyQuery) => {
  const { filters, pagination, sort } = query;
  const mongoQuery: any = {};

  if (filters.type) {
    mongoQuery.type = filters.type;
  }
  if (filters.city) {
    mongoQuery["address.city"] = {
      $regex: filters.city,
      $options: "i",
    };
  }
  if (filters.state) {
    mongoQuery["address.state"] = {
      $regex: filters.state,
      $options: "i",
    };
  }
  if (filters.country) {
    mongoQuery["address.country"] = {
      $regex: filters.country,
      $options: "i",
    };
  }

  if (filters.minPrice || filters.maxPrice) {
    mongoQuery.price = {};
    if (filters.minPrice !== undefined) {
      mongoQuery.price.$gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      mongoQuery.price.$lte = filters.maxPrice;
    }
  }
  if (filters.search) {
    mongoQuery.$or = [
      {
        title: { $regex: filters.search, $options: "i" },
      },
      {
        description: { $regex: filters.search, $options: "i" },
      },
    ];
  }
  const properties = await Property.find(mongoQuery)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort({ [sort.field]: sort.order });

  return properties;
};

export const getPropertyByIdService = async (propertyId: string) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.PROPERTY_NOT_FOUND,
      "Property not found",
    );
  }
  return property;
};

export const deletePropertyService = async (propertyId: string, user: any) => {
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
    if (
      property.owner.toString() !== user.userId &&
      !user.roles.includes("ADMIN")
    ) {
      CustomError.throwError(
        HttpCodes.FORBIDDEN,
        AppCodes.AUTH_UNAUTHORIZED,
        "Not authorized to delete this property",
      );
    }

    const tenancies = await Tenancy.find({
      property: propertyId,
      ...getActiveTenancyFilter(),
    }).session(session);

    if (tenancies.length > 0) {
      CustomError.throwError(
        HttpCodes.BAD_REQUEST,
        AppCodes.PROPERTY_DELETE_NOT_ALLOWED,
        "Cannot delete property with active tenancies",
      );
    }
    const storageService = new S3StorageService();

    if (property.images && property.images.length > 0) {
      await Promise.all(
        property.images.map((image) => storageService.delete(image.url)),
      );
    }

    const ownerships = await Ownership.find({
      property: propertyId,
      disposedAt: null,
    }).session(session);
    for (const ownership of ownerships) {
      ownership.disposedAt = new Date();
      await ownership.save({ session });
    }

    await property.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const updatePropertyService = async (
  propertyId: string,
  data: UpdatePropertyDTO,
  user: any,
  files?: Express.Multer.File[],
) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.PROPERTY_NOT_FOUND,
      "Property not found",
    );
  }

checkPermissions(user, property.owner);

  const imagesToRemove = data.imagesToRemove || [];

  const storageService = new S3StorageService();
  // remove images if requested
  if (imagesToRemove?.length) {
    await Promise.all(
      imagesToRemove.map((key: string) =>
        storageService.delete(
          `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        ),
      ),
    );

    property.images = property.images.filter(
      (image) => !imagesToRemove.includes(image.key),
    );
  }

  // add new images if provided

  if (files && files.length > 0) {
    const uploaded = await Promise.all(
      files.map((file) => storageService.upload(file, "properties")),
    );
    property.images.push(...uploaded);
  }

  delete data.imagesToRemove; // remove this field from data so it doesn't get set on the property

  if (data.title !== undefined) property.title = data.title;
  if (data.description !== undefined) property.description = data.description;
  if (data.price !== undefined) property.price = data.price;
  if (data.type !== undefined) property.type = data.type;

  if (data.bedrooms !== undefined) property.bedrooms = data.bedrooms;
  if (data.bathrooms !== undefined) property.bathrooms = data.bathrooms;
  if (data.area !== undefined) property.area = data.area;

  if (data.address) {
    property.address = {
      ...property.address,
      ...data.address,
    };
  }
  await property.save();

  return property;
};

export const getMyRentedPropertiesService = async (userId: string) => {
  const properties = await Property.find({ "tenants.userId": userId });
  return properties;
};

export const getMyListedPropertiesService = async (userId: string) => {
  const properties = await Property.find({ owner: userId });
  return properties;
};
