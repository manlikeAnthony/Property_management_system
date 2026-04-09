import User from "../../../models/user.model";
import { becomeLandlordService } from "../../landlord.service";
import { CustomError } from "../../../errors/CustomError";
import { HttpCodes } from "../../../errors/HttpCodes";
import { AppCodes } from "../../../errors/AppCodes";
import { CustomLogger } from "../../../logger/CustomLogger";

describe("Become Landlord Service", () => {
  let customErrorSpy: jest.SpyInstance;
  let findUserSpy: jest.SpyInstance;

  beforeEach(() => {
    findUserSpy = jest.spyOn(User, "findById");
    customErrorSpy = jest.spyOn(CustomError, "throwError");
    CustomLogger.info = jest.fn();
    CustomLogger.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully apply to become a landlord", async () => {
    const mockUser = {
      userId: "user123",
      roles: ["USER"],
      save: jest.fn().mockResolvedValue(true),
      landlordProfile: {
        applicationStatus: "PENDING",
      },
    };
    findUserSpy.mockResolvedValue(mockUser);

    const result = await becomeLandlordService(mockUser.userId);
    // assert
    expect(findUserSpy).toHaveBeenCalledWith(mockUser.userId);
    expect(mockUser.roles).toContain("LANDLORD");
    expect(mockUser.landlordProfile).toEqual({ applicationStatus: "PENDING" });
    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it("should throw error if user is not found", async () => {
    //arrange
    const nonExistentUserId = "nonexistentUserId";
    findUserSpy.mockResolvedValue(null);

    //act and assert
    expect(becomeLandlordService("nonexistentUserId")).rejects.toThrow(
      "User not found",
    );
    expect(findUserSpy).toHaveBeenCalledWith(nonExistentUserId);
    expect(customErrorSpy).toHaveBeenCalledWith(
      HttpCodes.NOT_FOUND,
      AppCodes.USER_NOT_FOUND,
      "User not found",
    );
  });

  it("should throw error if userId is not provided", async () => {
    const mockUser = {
      userId: "",
      roles: ["USER"],
      save: jest.fn().mockResolvedValue(true),
    };

    //act + assert
    await expect(becomeLandlordService(mockUser.userId)).rejects.toThrow(
      "User ID is required",
    );

    expect(findUserSpy).not.toHaveBeenCalled();
    expect(customErrorSpy).toHaveBeenCalledWith(
      HttpCodes.BAD_REQUEST,
      AppCodes.INVALID_INPUT,
      "User ID is required",
    );
    expect(mockUser.save).not.toHaveBeenCalled();
  });

  it("should throw error if user is already a landlord", async () => {
    const mockUser = {
      userId: "user123",
      roles: ["USER", "LANDLORD"],
      save: jest.fn().mockResolvedValue(true),
    };
    findUserSpy.mockResolvedValue(mockUser);

    await expect(becomeLandlordService(mockUser.userId)).rejects.toThrow(
      "User is already a landlord",
    );
    expect(customErrorSpy).toHaveBeenCalledWith(
      HttpCodes.CONFLICT,
      AppCodes.LANDLORD_ALREADY_EXISTS,
      "User is already a landlord",
    );
    expect(mockUser.save).not.toHaveBeenCalled();
  });
});
