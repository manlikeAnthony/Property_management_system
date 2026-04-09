import User from "../../../models/user.model";
import { resetPasswordService } from "../../auth.service";
import crypto from "crypto";

describe("resetPasswordService", () => {
  let findUserSpy: jest.SpyInstance;

  beforeEach(() => {
    findUserSpy = jest.spyOn(User, "findOne");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return if user does not exist", async () => {
    findUserSpy.mockResolvedValue(null);

    await expect(
      resetPasswordService({
        email: "test@gmail.com",
        token: "token",
        password: "newpass",
      }),
    ).resolves.toBeUndefined();
  });

  it("should reset password if token is valid", async () => {
    const rawToken = "valid_token";
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const mockUser: any = {
      passwordToken: hashedToken,
      passwordTokenExpirationDate: new Date(Date.now() + 10000),
      save: jest.fn(),
    };

    findUserSpy.mockResolvedValue(mockUser);

    await resetPasswordService({
      email: "test@gmail.com",
      token: rawToken,
      password: "newpass",
    });

    expect(mockUser.password).toBe("newpass");
    expect(mockUser.passwordToken).toBeUndefined();
    expect(mockUser.passwordTokenExpirationDate).toBeUndefined();
    expect(mockUser.save).toHaveBeenCalled();
  });

  it("should return if token is invalid", async () => {
    const mockUser: any = {
      passwordToken: "wrong",
      passwordTokenExpirationDate: new Date(Date.now() + 10000),
      save: jest.fn(),
    };

    findUserSpy.mockResolvedValue(mockUser);

    await resetPasswordService({
      email: "test@gmail.com",
      token: "invalid",
      password: "newpass",
    });

    expect(mockUser.save).not.toHaveBeenCalled();
  });

  it("should return if token is expired", async () => {
    const rawToken = "valid_token";
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const mockUser: any = {
      passwordToken: hashedToken,
      passwordTokenExpirationDate: new Date(Date.now() - 10000),
      save: jest.fn(),
    };

    findUserSpy.mockResolvedValue(mockUser);

    await resetPasswordService({
      email: "test@gmail.com",
      token: rawToken,
      password: "newpass",
    });

    expect(mockUser.save).not.toHaveBeenCalled();
  });

  it("should propagate database error", async () => {
    findUserSpy.mockRejectedValue(new Error("DB error"));

    await expect(
      resetPasswordService({
        email: "test@gmail.com",
        token: "token",
        password: "newpass",
      }),
    ).rejects.toThrow("DB error");
  });
});