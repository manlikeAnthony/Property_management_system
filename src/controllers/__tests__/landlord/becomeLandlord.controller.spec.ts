import { becomeLandlord } from "../../landlord.controller";
import { becomeLandlordService } from "../../../services/landlord.service";
import { HttpCodes } from "../../../errors/HttpCodes";
import { AppCodes } from "../../../errors/AppCodes";
import { Request, Response } from "express";
import { CustomError } from "../../../errors/CustomError";
import { CustomLogger } from "../../../logger/CustomLogger";

jest.mock("../../../services/landlord.service");

describe("Become Landlord Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let customErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    req = {
      user: {
        userId: "user123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    customErrorSpy = jest.spyOn(CustomError, "throwError");
    CustomLogger.error = jest.fn();
    CustomLogger.info = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

    it("should submit landlord application successfully", async () => {
    const mockUser = {
      userId: "user123",
      roles: ["LANDLORD"],
      landlordProfile: { applicationStatus: "PENDING" },
    };
    (becomeLandlordService as jest.Mock).mockResolvedValue(mockUser);
    await becomeLandlord(req as Request, res as Response);

    expect(becomeLandlordService).toHaveBeenCalledWith("user123");
    expect(res.status).toHaveBeenCalledWith(HttpCodes.OK);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Landlord application submitted successfully",
        data: mockUser,
        code: AppCodes.LANDLORD_APPLICATION_SUBMITTED,
      }),
    );
  });

  it("should handle errors thrown by becomeLandlordService", async () => {
    (becomeLandlordService as jest.Mock).mockRejectedValue(new Error("Service error"));

    await expect(becomeLandlord(req as Request, res as Response)).rejects.toThrow("Service error");

    expect(becomeLandlordService).toHaveBeenCalledWith("user123");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

});
