import User from "../../../models/user.model";
import { resendVerificationEmailService } from "../../auth.service";
import { CustomError } from "../../../errors/CustomError";
import { HttpCodes } from "../../../errors/HttpCodes";
import { AppCodes } from "../../../errors/AppCodes";

describe("resendVerificationEmailService", () => {
  let findUserSpy: jest.SpyInstance;
  let saveSpy: jest.Mock;
  let customErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    findUserSpy = jest.spyOn(User, "findOne");
    customErrorSpy = jest.spyOn(CustomError, "throwError");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should generate new verification token and return user data", async () => {
    const mockUser: any = {
      name: "Anthony",
      email: "test@gmail.com",
      isVerified: false,
      verificationToken: "",
      save: jest.fn(),
    };

    findUserSpy.mockResolvedValue(mockUser);

    const result = await resendVerificationEmailService("test@gmail.com");

    expect(findUserSpy).toHaveBeenCalledWith({ email: "test@gmail.com" });

    expect(mockUser.save).toHaveBeenCalled();

    expect(result).toEqual(
      expect.objectContaining({
        name: "Anthony",
        email: "test@gmail.com",
        verificationToken: expect.any(String),
      }),
    );
  });

  it("should throw error if user not found", async () => {
    findUserSpy.mockResolvedValue(null);

    await expect(
      resendVerificationEmailService("test@gmail.com"),
    ).rejects.toThrow("User not found");

    expect(customErrorSpy).toHaveBeenCalledWith(
      HttpCodes.NOT_FOUND,
      AppCodes.USER_NOT_FOUND,
      "User not found",
    );
  });

  it("should throw error if user already verified", async () => {
    findUserSpy.mockResolvedValue({
      isVerified: true,
    });

    await expect(
      resendVerificationEmailService("test@gmail.com"),
    ).rejects.toThrow("User already verified");

    expect(customErrorSpy).toHaveBeenCalledWith(
      HttpCodes.CONFLICT,
      AppCodes.USER_ALREADY_VERIFIED,
      "User already verified",
    );
  });

  it("should propagate database error", async () => {
    findUserSpy.mockRejectedValue(new Error("DB error"));

    await expect(
      resendVerificationEmailService("test@gmail.com"),
    ).rejects.toThrow("DB error");
  });
});