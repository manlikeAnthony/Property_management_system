import Token from "../../../models/token.model";
import { logoutService } from "../../auth.service";
import { CustomLogger } from "../../../logger/CustomLogger";

describe("logoutService", () => {
  let deleteSpy: jest.SpyInstance;

  beforeEach(() => {
    deleteSpy = jest.spyOn(Token, "deleteMany");
    CustomLogger.error = jest.fn();
    CustomLogger.info = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete tokens if userId provided", async () => {
    deleteSpy.mockResolvedValue({});

    await logoutService("user-id");

    expect(deleteSpy).toHaveBeenCalledWith({ user: "user-id" });
  });

  it("should do nothing if userId not provided", async () => {
    await logoutService();

    expect(deleteSpy).not.toHaveBeenCalled();
  });
});