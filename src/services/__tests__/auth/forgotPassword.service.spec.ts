import User from "../../../models/user.model";
import { forgotPasswordService } from "../../auth.service";

describe("forgotPasswordService", () => {
  let findUserSpy: jest.SpyInstance;
    let data : any;

  beforeEach(() => {
    data = {
        email : "test@gmail.com"
    }
    findUserSpy = jest.spyOn(User, "findOne");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return null if user does not exist", async () => {
    findUserSpy.mockResolvedValue(null);

    const result = await forgotPasswordService(data.email);

    expect(result).toBeNull();
  });

  it("should generate password token and save user", async () => {
    const mockUser: any = {
      name: "Anthony",
      email: "test@gmail.com",
      save: jest.fn(),
    };

    findUserSpy.mockResolvedValue(mockUser);

    const result = await forgotPasswordService("test@gmail.com");

    expect(mockUser.passwordToken).toBeDefined();
    expect(mockUser.passwordTokenExpirationDate).toBeDefined();
    expect(mockUser.save).toHaveBeenCalled();

    expect(result).toEqual(
      expect.objectContaining({
        name: "Anthony",
        email: "test@gmail.com",
        passwordToken: expect.any(String),
      }),
    );
  });

  it("should hash token before saving", async () => {
    const mockUser: any = {
      save: jest.fn(),
    };

    findUserSpy.mockResolvedValue(mockUser);

    const result = await forgotPasswordService("test@gmail.com");

    expect(mockUser.passwordToken).not.toEqual(result?.passwordToken);
  });

  it("should propagate database error", async () => {
    findUserSpy.mockRejectedValue(new Error("DB error"));

    await expect(
      forgotPasswordService("test@gmail.com"),
    ).rejects.toThrow("DB error");
  });
});