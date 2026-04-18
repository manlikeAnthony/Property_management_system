import Ownership from "../models/ownership.model";
import { CustomError } from "../errors/CustomError";
import { HttpCodes } from "../errors/HttpCodes";
import { AppCodes } from "../errors/AppCodes";
import {
  purchasePropertyService,
  transferOwnershipService,
  getOwnershipHistoryService,
  getCurrentOwnerService,
  getOwnershipByIdService,
  deleteOwnershipService,
} from "../services/ownership.service";
import { Request, Response } from "express";
import { Params } from "../types/auth.types";
import { successResponse } from "../response";
import {parseOwnershipQuery} from "../query/ownership/ownership.query";

export const purchaseProperty = async (req: Request<Params>, res: Response) => {
  const { id: propertyId } = req.params;
  const buyerId = req.user.userId;
   await purchasePropertyService(propertyId, buyerId);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Property purchased successfully",
      data: null,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const transferOwnership = async (
  req: Request<Params>,
  res: Response,
) => {
  const { id: propertyId } = req.params;
  const newOwnerId = req.body.newOwnerId;
  await transferOwnershipService(propertyId, newOwnerId , req.user);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Ownership transferred successfully",
      data: null,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const getOwnershipHistory = async (
  req: Request<Params>,
  res: Response,
) => {
  const { id: propertyId } = req.params;
  const query = parseOwnershipQuery(req);
  const history = await getOwnershipHistoryService(propertyId , req.user , query);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Ownership history retrieved successfully",
      data: history,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const getCurrentOwner = async (req: Request<Params>, res: Response) => {
  const { id: propertyId } = req.params;
  const owner = await getCurrentOwnerService(propertyId);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Current owner retrieved successfully",
      data: owner,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const getOwnershipById = async (req: Request<Params>, res: Response) => {
  const { id: ownershipId } = req.params;
  const ownership = await getOwnershipByIdService(ownershipId);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Ownership record retrieved successfully",
      data: ownership,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const deleteOwnership = async (req: Request<Params>, res: Response) => {
  const { id: ownershipId } = req.params;

  await deleteOwnershipService(ownershipId , req.user);

    res.status(HttpCodes.OK).json(
    successResponse({
      message: "Ownership record deleted successfully",
      data: null,
        code: AppCodes.SUCCESS,
    }),
  );
}

