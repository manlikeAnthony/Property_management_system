import { Request, Response } from "express";
import type { Params } from "../types/auth.types";
import {
  createPropertyService,
  getAllPropertiesService,
  deletePropertyService,
  updatePropertyService,
  getPropertyByIdService,
  getMyRentedPropertiesService,
  getMyListedPropertiesService
} from "../services/property.service";

import { successResponse } from "../response";
import { HttpCodes } from "../errors/HttpCodes";
import { AppCodes } from "../errors/AppCodes";
import { CustomError } from "../errors/CustomError";
import { S3StorageService } from "../services/s3.service";
import { parsePropertyQuery } from "../query/property/propertyQuery";
import {
  CreatePropertyDTO,
  UpdatePropertyDTO,
  CreatePropertyWithImagesDTO,
} from "../dto/property";
import {
  mapToCreatePropertyDTO,
  mapToUpdatePropertyDTO,
} from "../utils/mappers/property.mapper";

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
  const dto: CreatePropertyDTO = mapToCreatePropertyDTO(req.body);

  const data: CreatePropertyWithImagesDTO = {
    ...dto,
    images: uploadedImages,
  };

  const property = await createPropertyService(data, user);

  res.status(HttpCodes.CREATED).json(
    successResponse({
      message: "Property created successfully",
      data: property,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const getAllProperties = async (req: Request, res: Response) => {
  const query = parsePropertyQuery(req);

  const properties = await getAllPropertiesService(query);
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

  const dto: UpdatePropertyDTO = mapToUpdatePropertyDTO(req.body);

  dto.imagesToRemove = imagesToRemove;

  const updatedProperty = await updatePropertyService(
    propertyId,
    dto,
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

export const getMyRentedProperties = async (req: Request, res: Response) => {
  const properties = await getMyRentedPropertiesService(req.user.userId);

  res.status(HttpCodes.OK).json(
    successResponse({
      message: "User Rented Properties fetched successfully",
      data: properties,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const getMyListedProperties = async (req: Request, res: Response) => {
  const properties = await getMyListedPropertiesService(req.user.userId);

  res.status(HttpCodes.OK).json(
    successResponse({
      message: "User listed properties fetched successfully",
      data: properties,
      code: AppCodes.SUCCESS,
    }),
  );
};

/// FUNCTIONALITY ALREADY INTEGRATED IN getAllProperties WITH FILTERS. ENDPOINTS KEPT COMMENTED OUT FOR FUTURE REFERENCE IF NEEDED
// export const getAllPropertiesByType = async (req: Request, res: Response) => {
//   const query = parsePropertyQuery(req);

//   if (!query.filters.type) {
//     CustomError.throwError(
//       HttpCodes.BAD_REQUEST,
//       AppCodes.INVALID_INPUT,
//       "type query parameter is required ",
//     );
//   }

//   const properties = await getAllPropertiesByTypeService(query);
//   res.status(HttpCodes.OK).json(
//     successResponse({
//       message: "Properties fetched successfully",
//       data: properties,
//       code: AppCodes.SUCCESS,
//     }),
//   );
// };

// export const getAllPropertiesByLocation = async (
//   req: Request,
//   res: Response,
// ) => {
//   const query = parsePropertyQuery(req);

//   if (!query.filters.city && !query.filters.state && !query.filters.country) {
//     CustomError.throwError(
//       HttpCodes.BAD_REQUEST,
//       AppCodes.INVALID_INPUT,
//       "At least one of city, state or country query parameters is required",
//     );
//   }

//   const properties = await getAllPropertiesByLocationService(query);

//   res.status(HttpCodes.OK).json(
//     successResponse({
//       message: "Properties fetched successfully",
//       data: properties,
//       code: AppCodes.SUCCESS,
//     }),
//   );
// };
