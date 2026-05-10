import User from "../../../models/user.model";
import { registerService } from "../../auth.service";
import { CustomError } from "../../../errors/CustomError";
import { HttpCodes } from "../../../errors/HttpCodes";
import { AppCodes } from "../../../errors/AppCodes";
import { CustomLogger } from "../../../logger/CustomLogger";

describe("registerService", () => {
  let data: any;
  let findUserSpy: jest.SpyInstance;
  let countDocumentSpy: jest.SpyInstance;
  let createUserSpy: jest.SpyInstance;
  let customErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    data = {
      name: "Anthony",
      email: "test@gmail.com",
      password: "secret",
    };
    findUserSpy = jest.spyOn(User, "findOne");
    createUserSpy = jest.spyOn(User, "create");
    countDocumentSpy = jest.spyOn(User, "countDocuments");
    customErrorSpy = jest.spyOn(CustomError, "throwError");

    CustomLogger.info = jest.fn();
    CustomLogger.error = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create first user as ADMIN and return verification token", async () => {
    //arrange
    createUserSpy.mockResolvedValue({} as any);
    findUserSpy.mockResolvedValue(null);
    countDocumentSpy.mockResolvedValue(0);

    // act
    const result = await registerService(data);

    // assert
    expect(User.findOne).toHaveBeenCalledWith({ email: data.email });

    expect(createUserSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: data.name,
        email: data.email,
        password: data.password,
        roles: ["ADMIN"], // first user
        isVerified: false,
        verificationToken: expect.any(String),
      }),
    );

    expect(result).toEqual(
      expect.objectContaining({
        user: expect.any(Object),
        verificationToken: expect.any(String),
      }),
    );
  });

  it("should create user as USER if first user already exists", async () => {
    //arrange
    createUserSpy.mockResolvedValue({} as any);
    findUserSpy.mockResolvedValue(null);
    countDocumentSpy.mockResolvedValue(1);

    // act
    const result = await registerService(data);

    // assert
    expect(findUserSpy).toHaveBeenCalledWith({ email: data.email });

    expect(createUserSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: data.name,
        email: data.email,
        password: data.password,
        roles: ["USER"],
        isVerified: false,
        verificationToken: expect.any(String),
      }),
    );

    expect(result).toEqual(
      expect.objectContaining({
        user: expect.any(Object),
        verificationToken: expect.any(String),
      }),
    );
  });
  it("should return error if user already exists", async () => {
    //arrange
    findUserSpy.mockResolvedValue({} as any);

    //act + assert
    await expect(registerService(data)).rejects.toThrow("Email already in use");

    expect(findUserSpy).toHaveBeenCalledWith({ email: "test@gmail.com" });

    expect(customErrorSpy).toHaveBeenCalledWith(
      HttpCodes.BAD_REQUEST,
      AppCodes.USER_ALREADY_EXISTS,
      "Email already in use",
    );
    expect(createUserSpy).not.toHaveBeenCalled();
  });
  it("should return error if required fields are missing", async () => {
    //arrange
    data = {
      name: "",
      email: "",
      password: "",
    };
    //act + assert
    await expect(registerService(data)).rejects.toThrow(
      "Missing required fields",
      );
    expect(customErrorSpy).toHaveBeenCalledWith(
      HttpCodes.BAD_REQUEST,
      AppCodes.MISSING_REQUIRED_FIELD,
      "Missing required fields",
      );
    expect(findUserSpy).not.toHaveBeenCalled();
    expect(createUserSpy).not.toHaveBeenCalled();
  });
  it("should propagate error if database operation fails", async () => {
    //arrange
    findUserSpy.mockRejectedValue(new Error("Database error"));

    //act + assert
    await expect(registerService(data)).rejects.toThrow("Database error");
    expect(findUserSpy).toHaveBeenCalledWith({ email: data.email });
    expect(createUserSpy).not.toHaveBeenCalled();
  });
  it("should propagate error if countDocuments fails", async () => {
    //arrange
    findUserSpy.mockResolvedValue(null);
    countDocumentSpy.mockRejectedValue(new Error("Count error"));

    //act + assert
    await expect(registerService(data)).rejects.toThrow("Count error");
    expect(findUserSpy).toHaveBeenCalledWith({ email: data.email });
    expect(countDocumentSpy).toHaveBeenCalled();
    expect(createUserSpy).not.toHaveBeenCalled();

  });
});
