import { register } from "../../auth.controller";
import { registerService } from "../../../services/auth.service";
import { sendVerificationEmail } from "../../../utils/email";
import { Request, response, Response } from "express";
import { HttpCodes } from "../../../errors/HttpCodes";
import { AppCodes } from "../../../errors/AppCodes";
import { CustomLogger } from "../../../logger/CustomLogger";

jest.mock("../../../utils/email");
jest.mock("../../../services/auth.service");

describe("Register Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        name: "Anthony",
        email: "test@gmail.com",
        password: "secret",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    CustomLogger.info = jest.fn();
    CustomLogger.error = jest.fn();
  });

  afterEach(()=>{
    jest.clearAllMocks()
  })

  it("should register user and send email", async () => {
    //arrange
    (registerService as jest.Mock).mockResolvedValue({
      user: {
        name: "Anthony",
        email: "test@gmail.com",
        password: "secret",
      },
      verificationToken: "token123",
    });

    //act
    await register(req as Request, res as Response);

    //assert
    expect(registerService).toHaveBeenCalledWith(req.body);

    expect(sendVerificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Anthony",
        email: "test@gmail.com",
        verificationToken: "token123",
      }),
    );

    expect(res.status).toHaveBeenCalledWith(HttpCodes.CREATED);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User registered successfully",
        data: null,
        code: AppCodes.USER_CREATED,
      }),
    );
  });

  it("should propagate error if registerService fails", async () => {
    //arrange
    (registerService as jest.Mock).mockRejectedValue(
      new Error("something went wrong"),
    );

    //act
    await expect(register(req as Request, res as Response)).rejects.toThrow(
      "something went wrong",
    );

    expect(sendVerificationEmail).not.toHaveBeenCalled();
  });


  it("should throw error if input is invalid", async () => {
    req.body = {
      name: "",
      email: "",
      password: "",
    };

    (registerService as jest.Mock).mockRejectedValue(
      new Error("Missing required fields"),
    );

    await expect(register(req as Request, res as Response)).rejects.toThrow(
      "Missing required fields",
    );

    expect(sendVerificationEmail).not.toHaveBeenCalled();
  });
  
  it("should throw error if email sending fails", async () => {
  (registerService as jest.Mock).mockResolvedValue({
    user: {
      name: "Anthony",
      email: "test@gmail.com",
    },
    verificationToken: "token123",
  });

  (sendVerificationEmail as jest.Mock).mockRejectedValue(
    new Error("Email failed")
  );

  await expect(
    register(req as Request, res as Response)
  ).rejects.toThrow("Email failed");

  expect(registerService).toHaveBeenCalled();
});
});
