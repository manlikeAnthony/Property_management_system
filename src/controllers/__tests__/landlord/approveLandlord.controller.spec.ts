import { approveLandlord } from "../../landlord.controller";
import { approveLandlordService } from "../../../services/landlord.service";
import { HttpCodes } from "../../../errors/HttpCodes";
import { AppCodes } from "../../../errors/AppCodes";
import { Request, Response } from "express";
import { CustomError } from "../../../errors/CustomError";
import { CustomLogger } from "../../../logger/CustomLogger";
import type { Params } from "../../../types/auth.types";

jest.mock("../../../services/landlord.service");

describe("Approve Landlord Controller", () => {
  let req: Partial<Request<Params>>;
  let res: Partial<Response>;
  let customErrorSpy: jest.SpyInstance;

    beforeEach(() => {
    req = {
        params: {
            id: "user123"
        }
    };
    res = { 
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }
    customErrorSpy = jest.spyOn(CustomError, "throwError");
    CustomLogger.error = jest.fn();
    CustomLogger.info = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

    it("should approve landlord application successfully", async () => {
        //arrange
        (approveLandlordService as jest.Mock).mockResolvedValue({
            userId: "user123",
            roles: ["LANDLORD"],
            landlordProfile: { applicationStatus: "APPROVED" }
        });

        //act
        await approveLandlord(req as Request<Params>, res as Response);
        
        //assert
        expect(approveLandlordService).toHaveBeenCalledWith("user123");
        expect(res.status).toHaveBeenCalledWith(HttpCodes.OK);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Landlord application approved successfully",
                data: {
                    userId: "user123",
                    roles: ["LANDLORD"],
                    landlordProfile: { applicationStatus: "APPROVED" }
                },
                code: AppCodes.LANDLORD_APPLICATION_APPROVED,
            })
        );
    });

    it("should propagate errors thrown by approveLandlordService", async () => {
        //arrange
        (approveLandlordService as jest.Mock).mockRejectedValue(new Error("Service error"));

        //act and assert
        await expect(approveLandlord(req as Request<Params>, res as Response)).rejects.toThrow("Service error");
        expect(approveLandlordService).toHaveBeenCalledWith("user123");
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle missing user ID in request params", async () => {
        //arrange
        req.params = {id : ""};

        //act and assert
        await expect(approveLandlord(req as Request<Params>, res as Response)).rejects.toThrow("User ID is required");
        expect(approveLandlordService).not.toHaveBeenCalled();
        expect(customErrorSpy).toHaveBeenCalledWith(
            HttpCodes.BAD_REQUEST,
            AppCodes.INVALID_INPUT,
            "User ID is required"
        );
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

});