import { Request, Response } from "express";
import type { Params } from "../types/auth.types";
import {
  createPropertyService,
  getAllPropertiesService,
  deletePropertyService,
  updatePropertyService,
  getPropertyByIdService,
  getUserRentedPropertiesService,
  getAllPropertiesOnSaleService,
  getAllPropertiesForRentService,
  getAllPropertiesByTypeService,
  getAllPropertiesByLocationService,
} from "../services/property.service";
import { successResponse } from "../response";
import { HttpCodes } from "../errors/HttpCodes";
import { AppCodes } from "../errors/AppCodes";
import { CustomError } from "../errors/CustomError";
import { S3StorageService } from "../services/s3.service";

export const createProperty = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    CustomError.throwError(
      HttpCodes.UNAUTHORIZED,
      AppCodes.AUTH_UNAUTHORIZED,
      "User not authenticated",
    );
  }
  const files = req.files;

  if (!files || !(files instanceof Array) || files.length === 0) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.INVALID_INPUT,
      "At least one image file is required",
    );
  }
  const storageService = new S3StorageService();

  const uploadedImages: { url: string; key: string }[] = [];

  for (const file of files) {
    try {
      const result = await storageService.upload(file, "properties");
      uploadedImages.push(result);
    } catch (err) {
      await Promise.all(
        uploadedImages.map((image) => storageService.delete(image.url)),
      );

      throw err;
    }
  }

  const property = await createPropertyService(
    {
      ...req.body,
      images: uploadedImages,
    },
    user,
  );

  res.status(HttpCodes.CREATED).json(
    successResponse({
      message: "Property created successfully",
      data: property,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const getAllProperties = async (_req: Request, res: Response) => {
  const properties = await getAllPropertiesService();
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Properties retrieved successfully",
      data: properties,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const getPropertyById = async (req: Request<Params>, res: Response) => {
  const { id: propertyId } = req.params;
  if (!propertyId) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.INVALID_INPUT,
      "propertyId not provided",
    );
  }
  const property = await getPropertyByIdService(propertyId);

  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Property retrieved successfully",
      data: property,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const deleteProperty = async (req: Request<Params>, res: Response) => {
  const { id: propertyId } = req.params;
  if (!propertyId) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.INVALID_INPUT,
      "propertyId not provided",
    );
  }
  await deletePropertyService(propertyId, req.user);

  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Property deleted successfully",
      data: null,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const updateProperty = async (req: Request<Params>, res: Response) => {
  const { id: propertyId } = req.params;
  if (!propertyId) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.INVALID_INPUT,
      "propertyId not provided",
    );
  }
  const user = req.user;

  if (!user) {
    CustomError.throwError(
      HttpCodes.UNAUTHORIZED,
      AppCodes.AUTH_UNAUTHORIZED,
      "User not authenticated",
    );
  }

  const files: Express.Multer.File[] = req.files as Express.Multer.File[];

  let imagesToRemove: string[] = [];

  if (req.body.imagesToRemove) {
    try {
      imagesToRemove = JSON.parse(req.body.imagesToRemove);
    } catch (error) {
      CustomError.throwError(
        HttpCodes.BAD_REQUEST,
        AppCodes.INVALID_INPUT,
        "Invalid imagesToRemove format",
      );
    }
  }

  const updatedProperty = await updatePropertyService(
    propertyId,
    { ...req.body, imagesToRemove },
    user,
    files,
  );

  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Property updated successfully",
      data: updatedProperty,
      code: AppCodes.SUCCESS,
    }),
  );
};
