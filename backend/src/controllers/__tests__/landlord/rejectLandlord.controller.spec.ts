import {rejectLandlord} from "../../landlord.controller";
import {rejectLandlordService} from "../../../services/landlord.service";
import {HttpCodes} from "../../../errors/HttpCodes";
import {AppCodes} from "../../../errors/AppCodes";
import {Request, Response} from "express";
import {CustomError} from "../../../errors/CustomError";
import {CustomLogger} from "../../../logger/CustomLogger";
import type {Params} from "../../../types/auth.types";

jest.mock("../../../services/landlord.service");

describe("Reject Landlord Controller", () => {
    let req: Partial<Request<Params>>;
    let res: Partial<Response>;
    let customErrorSpy: jest.SpyInstance;

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
        customErrorSpy = jest.spyOn(CustomError, "throwError");
        CustomLogger.error = jest.fn();
        CustomLogger.info = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should reject landlord application successfully", async () => {
        const mockUser = {
            userId: "user123",
            roles: ["LANDLORD"],
            landlordProfile: { applicationStatus: "REJECTED" }
        };
        (rejectLandlordService as jest.Mock).mockResolvedValue(mockUser);

        await rejectLandlord(req as Request<Params>, res as Response);

        expect(rejectLandlordService).toHaveBeenCalledWith("user123");
        expect(res.status).toHaveBeenCalledWith(HttpCodes.OK);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Landlord application rejected successfully",
                data: mockUser,
                code: AppCodes.LANDLORD_APPLICATION_REJECTED,
            })
        );
    });

    it("should handle errors thrown by rejectLandlordService", async () => {
        (rejectLandlordService as jest.Mock).mockRejectedValue(new Error("Service error"));

        await expect(rejectLandlord(req as Request<Params>, res as Response)).rejects.toThrow("Service error");
        expect(rejectLandlordService).toHaveBeenCalledWith("user123");
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
