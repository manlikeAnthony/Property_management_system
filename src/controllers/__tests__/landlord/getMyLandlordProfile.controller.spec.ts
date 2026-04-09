import { getMyLandlordProfile } from "../../landlord.controller";
import { getMyLandlordProfileService } from "../../../services/landlord.service";
import { HttpCodes } from "../../../errors/HttpCodes";
import { AppCodes } from "../../../errors/AppCodes";
import { Request, Response } from "express";
import { CustomError } from "../../../errors/CustomError";
import { CustomLogger } from "../../../logger/CustomLogger";
import { Params } from "../../../types/auth.types";

jest.mock("../../../services/landlord.service");
jest.mock("../../../utils/checkPermissions");

describe("Get Landlord Profile Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let checkPermissionsSpy: jest.SpyInstance;

  beforeEach(() => {
    req = {
      params: {
        id: "user123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    checkPermissionsSpy = jest.spyOn(
      require("../../../utils"),
      "checkPermissions",
    );
    CustomLogger.error = jest.fn();
    CustomLogger.info = jest.fn();
  });

  it("should retrieve landlord profile successfully", async () => {
    //arrange
    const mockUser = {
      userId: "user123",
      roles: ["LANDLORD"],
      landlordProfile: { applicationStatus: "APPROVED" },
    };
    (getMyLandlordProfileService as jest.Mock).mockResolvedValue(mockUser);

    //act
    await getMyLandlordProfile(req as Request<Params>, res as Response);

    //assert
    expect(getMyLandlordProfileService).toHaveBeenCalledWith("user123");
    expect(res.status).toHaveBeenCalledWith(HttpCodes.OK);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Landlord profile retrieved successfully",
        data: mockUser,
        code: AppCodes.LANDLORD_PROFILE_RETRIEVED,
      }),
    );
  });

  it("should handle errors thrown by getMyLandlordProfileService", async () => {
    //arrange
    (getMyLandlordProfileService as jest.Mock).mockRejectedValue(
      new Error("Service error"),
    );

    //act & assert
    await expect(
      getMyLandlordProfile(req as Request<Params>, res as Response),
    ).rejects.toThrow("Service error");

    expect(getMyLandlordProfileService).toHaveBeenCalledWith("user123");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should check permissions correctly", async () => {
    //arrange
    const mockUser = {
      userId: "user123",
      roles: ["LANDLORD"],
      landlordProfile: { applicationStatus: "APPROVED" },
    };
    (getMyLandlordProfileService as jest.Mock).mockResolvedValue(mockUser);

    await getMyLandlordProfile(req as Request<Params>, res as Response);

    expect(getMyLandlordProfileService).toHaveBeenCalledWith("user123");
    expect(checkPermissionsSpy).toHaveBeenCalledWith(req.user, mockUser.userId);
    expect(res.status).toHaveBeenCalledWith(HttpCodes.OK);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Landlord profile retrieved successfully",
        data: mockUser,
        code: AppCodes.LANDLORD_PROFILE_RETRIEVED,
      }),
    );
  });

  it("should handle permission errors correctly", async () => {
    //arrange
    const mockUser = {
      userId: "user123",
      roles: ["LANDLORD"],
      landlordProfile: { applicationStatus: "APPROVED" },
    };
    (getMyLandlordProfileService as jest.Mock).mockResolvedValue(mockUser);
    checkPermissionsSpy.mockImplementation(() => {
      CustomError.throwError(
        HttpCodes.FORBIDDEN,
        AppCodes.AUTH_UNAUTHORIZED,
        "You are not authorized to access this route",
      );
    });

    //act & assert
    await expect(
      getMyLandlordProfile(req as Request<Params>, res as Response),
    ).rejects.toThrow("You are not authorized to access this route");

    expect(getMyLandlordProfileService).toHaveBeenCalledWith("user123");
    expect(checkPermissionsSpy).toHaveBeenCalledWith(req.user, mockUser.userId);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

});
