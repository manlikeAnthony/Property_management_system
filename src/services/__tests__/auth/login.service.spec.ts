import User from "../../../models/user.model";
import Token from "../../../models/token.model";
import { loginService } from "../../auth.service";
import { CustomError } from "../../../errors/CustomError";
import { HttpCodes } from "../../../errors/HttpCodes";
import { AppCodes } from "../../../errors/AppCodes";
import { CustomLogger } from "../../../logger/CustomLogger";
import * as utils from "../../../utils";

jest.mock("../../../models/user.model");
jest.mock("../../../models/token.model");
jest.mock("../../../utils");

describe("loginService", () => {
  let findUserSpy: jest.SpyInstance;
  let findTokenSpy: jest.SpyInstance;
  let createTokenSpy: jest.SpyInstance;
  let customErrorSpy: jest.SpyInstance;
  let createTokenUserSpy: jest.SpyInstance;

  const mockUser: any = {
    _id: "user-id",
    email: "test@gmail.com",
    isVerified: true,
    comparePassword: jest.fn(),
  };

  beforeEach(() => {
    findUserSpy = jest.spyOn(User, "findOne");
    findTokenSpy = jest.spyOn(Token, "findOne");
    createTokenSpy = jest.spyOn(Token, "create");
    customErrorSpy = jest.spyOn(CustomError, "throwError");

    createTokenUserSpy = jest.spyOn(utils, "createTokenUser").mockReturnValue({ id: "user-id" } as any);

     CustomLogger.error = jest.fn();
     CustomLogger.info = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should login user and return existing refresh token", async () => {
    findUserSpy.mockResolvedValue(mockUser);
    mockUser.comparePassword.mockResolvedValue(true);

    findTokenSpy.mockResolvedValue({
      isValid: true,
      refreshToken: "existing_token",
    });

    const result = await loginService(
      { email: "test@gmail.com", password: "password" },
      {},
    );

    expect(result).toEqual({
      tokenUser: { id: "user-id" },
      refreshToken: "existing_token",
    });
  });

  it("should create new refresh token if none exists", async () => {
    findUserSpy.mockResolvedValue(mockUser);
    mockUser.comparePassword.mockResolvedValue(true);

    findTokenSpy.mockResolvedValue(null);

    const result = await loginService(
      { email: "test@gmail.com", password: "password" },
      { ip: "127.0.0.1", userAgent: "jest" },
    );

    expect(createTokenSpy).toHaveBeenCalled();
    expect(result.refreshToken).toEqual(expect.any(String));
  });

  it("should throw error if user not found", async () => {
    findUserSpy.mockResolvedValue(null);

    await expect(
      loginService({ email: "test@gmail.com", password: "pass" }, {}),
    ).rejects.toThrow("Invalid credentials");

    expect(customErrorSpy).toHaveBeenCalledWith(
      HttpCodes.UNAUTHORIZED,
      AppCodes.AUTH_INVALID_CREDENTIALS,
      "Invalid credentials",
    );
  });

  it("should throw error if password is incorrect", async () => {
    findUserSpy.mockResolvedValue(mockUser);
    mockUser.comparePassword.mockResolvedValue(false);

    await expect(
      loginService({ email: "test@gmail.com", password: "wrong" }, {}),
    ).rejects.toThrow("Invalid credentials");
  });

  it("should throw error if user is not verified", async () => {
    findUserSpy.mockResolvedValue({
      ...mockUser,
      isVerified: false,
      comparePassword: jest.fn().mockResolvedValue(true),
    });

    await expect(
      loginService({ email: "test@gmail.com", password: "pass" }, {}),
    ).rejects.toThrow("Account not verified");
  });

  it("should throw error if existing token is invalid", async () => {
    findUserSpy.mockResolvedValue(mockUser);
    mockUser.comparePassword.mockResolvedValue(true);

    findTokenSpy.mockResolvedValue({
      isValid: false,
    });

    await expect(
      loginService({ email: "test@gmail.com", password: "pass" }, {}),
    ).rejects.toThrow("Invalid credentials");
  });

  it("should throw error if required fields missing", async () => {
    await expect(loginService({ email: "", password: "" }, {})).rejects.toThrow(
      "Missing required fields",
    );

    expect(customErrorSpy).toHaveBeenCalledWith(
      HttpCodes.BAD_REQUEST,
      AppCodes.MISSING_REQUIRED_FIELD,
      "Missing required fields",
    );
  });
});
