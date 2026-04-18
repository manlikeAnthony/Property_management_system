import {
  createTenancyService,
  terminateTenancyService,
  getActiveTenanciesByPropertyService,
  getUserTenanciesService,
  getLandlordTenanciesService,
  getTenancyByIdService,
  getAllTenanciesService,
} from "../services/tenancy.service";
import { Request, Response } from "express";
import { Params } from "../types/auth.types";
import { successResponse } from "../response";
import { HttpCodes } from "../errors/HttpCodes";
import { AppCodes } from "../errors/AppCodes";

export const createTenancy = async (req: Request<Params>, res: Response) => {
  const { id: propertyId } = req.params;
  const { startDate, endDate } = req.body;
  const tenantId = req.user.userId;

  const tenancy = await createTenancyService(
    propertyId,
    tenantId,
    new Date(startDate),
    endDate ? new Date(endDate) : undefined,
  );

  res.status(HttpCodes.CREATED).json(
    successResponse({
      message: "Tenancy created successfully",
      data: tenancy,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const terminateTenancy = async (req: Request<Params>, res: Response) => {
  const { id: tenancyId } = req.params;
  await terminateTenancyService(tenancyId , req.user);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Tenancy terminated successfully",
      data: null,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const getActiveTenanciesByProperty = async (
  req: Request<Params>,
  res: Response,
) => {
  const { id: propertyId } = req.params;
  const tenancies = await getActiveTenanciesByPropertyService(propertyId);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Active tenancies retrieved successfully",
      data: tenancies,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const getUserTenancies = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const tenancies = await getUserTenanciesService(userId);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "User tenancies retrieved successfully",
      data: tenancies,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const getLandlordTenancies = async (req: Request, res: Response) => {
  const landlordId = req.user.userId;
  const tenancies = await getLandlordTenanciesService(landlordId);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Landlord tenancies retrieved successfully",
      data: tenancies,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const getTenancyById = async (req: Request<Params>, res: Response) => {
  const { id: tenancyId } = req.params;
  const tenancy = await getTenancyByIdService(tenancyId);
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "Tenancy retrieved successfully",
      data: tenancy,
      code: AppCodes.SUCCESS,
    }),
  );
};

export const getAllTenancies = async (_req: Request, res: Response) => {
  const tenancies = await getAllTenanciesService();
  res.status(HttpCodes.OK).json(
    successResponse({
      message: "All tenancies retrieved successfully",
      data: tenancies,
      code: AppCodes.SUCCESS,
    }),
  );
};
