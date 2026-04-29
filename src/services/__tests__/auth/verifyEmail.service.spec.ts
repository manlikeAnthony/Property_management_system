import User from "../../../models/user.model";
import { verifyEmailService } from "../../auth.service";
import { CustomError } from "../../../errors/CustomError";
import { HttpCodes } from "../../../errors/HttpCodes";
import { AppCodes } from "../../../errors/AppCodes";
import {CustomLogger} from "../../../logger/CustomLogger";

jest.mock("../../../models/user.model");

describe("verifyEmailService", () => {
  let findUserSpy: jest.SpyInstance;
  let customErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    findUserSpy = jest.spyOn(User, "findOne");
    customErrorSpy = jest.spyOn(CustomError, "throwError");
    CustomLogger.error = jest.fn();
    CustomLogger.info = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should verify user successfully", async () => {
    const mockUser: any = {
      isVerified: false,
      verificationToken: "valid_token",
      save: jest.fn(),
    };

    findUserSpy.mockResolvedValue(mockUser);

    const result = await verifyEmailService("valid_token", "test@gmail.com");

    expect(mockUser.isVerified).toBe(true);
    expect(mockUser.verificationToken).toBe("");
    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toBe(mockUser);
  });

  it("should throw if user not found", async () => {
    findUserSpy.mockResolvedValue(null);

    await expect(
      verifyEmailService("token", "test@gmail.com"),
    ).rejects.toThrow("User not found");
  });

  it("should throw if already verified", async () => {
    findUserSpy.mockResolvedValue({
      isVerified: true,
    });

    await expect(
      verifyEmailService("token", "test@gmail.com"),
    ).rejects.toThrow("user already verified");
  });

  it("should throw if token is invalid", async () => {
    findUserSpy.mockResolvedValue({
      isVerified: false,
      verificationToken: "correct",
    });

    await expect(
      verifyEmailService("wrong", "test@gmail.com"),
    ).rejects.toThrow("invalid verification token");
  });

  it("should throw if missing input", async () => {
    await expect(
      verifyEmailService("", ""),
    ).rejects.toThrow("missing required input");

    expect(customErrorSpy).toHaveBeenCalledWith(
      HttpCodes.BAD_REQUEST,
      AppCodes.MISSING_REQUIRED_FIELD,
      "missing required input",
    );
  });
});