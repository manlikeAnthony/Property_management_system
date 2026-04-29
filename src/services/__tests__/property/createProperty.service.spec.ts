import Property from "../../../models/property.model";
import { createPropertyService } from "../../property.service";
import { CustomError } from "../../../errors/CustomError";
import { HttpCodes } from "../../../errors/HttpCodes";
import { AppCodes } from "../../../errors/AppCodes";

describe("createPropertyService", () => {
  let data: any;
  let createSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    data = {
      title: "Beautiful Apartment",
      description: "Nice place",
      price: 1500,
      type: "RENT",
      address: {
        street: "123 Main St",
        city: "Lagos",
        state: "Lagos",
      },
      bedrooms: 2,
      bathrooms: 1,
      area: 800,
    };

    createSpy = jest.spyOn(Property, "create");
    errorSpy = jest.spyOn(CustomError, "throwError");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create property for approved landlord", async () => {
    const user = {
      userId: "user123",
      roles: ["LANDLORD"],
      landlordProfile: { status: "APPROVED" },
    };

    const mockProperty = { ...data, _id: "123" };
    createSpy.mockResolvedValue(mockProperty);

    const result = await createPropertyService(data, user);

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: data.title,
        price: data.price,
        type: data.type,
        owner: user.userId,
        listedBy: user.userId,
        images: [],
        isPublished: false,
      })
    );

    expect(result).toEqual(mockProperty);
  });

  it("should allow admin to create property", async () => {
    const user = {
      userId: "admin123",
      roles: ["ADMIN"],
    };

    createSpy.mockResolvedValue({} as any);

    await createPropertyService(data, user);

    expect(createSpy).toHaveBeenCalled();
  });

  it("should throw if user is not landlord or admin", async () => {
    const user = {
      userId: "user123",
      roles: ["USER"],
    };

    await expect(createPropertyService(data, user)).rejects.toThrow(
      "Not authorized to create property"
    );

    expect(errorSpy).toHaveBeenCalledWith(
      HttpCodes.FORBIDDEN,
      AppCodes.AUTH_UNAUTHORIZED,
      "Not authorized to create property"
    );
  });

  it("should throw if landlord is not approved", async () => {
    const user = {
      userId: "user123",
      roles: ["LANDLORD"],
      landlordProfile: { status: "PENDING" },
    };

    await expect(createPropertyService(data, user)).rejects.toThrow(
      "Not authorized to create property"
    );
  });

  it("should throw if required fields are missing", async () => {
    const user = {
      userId: "user123",
      roles: ["ADMIN"],
    };

    const invalidData = { ...data, title: "" };

    await expect(
      createPropertyService(invalidData, user)
    ).rejects.toThrow("Missing required property fields");

    expect(errorSpy).toHaveBeenCalledWith(
      HttpCodes.BAD_REQUEST,
      AppCodes.MISSING_REQUIRED_FIELD,
      "Missing required property fields"
    );
  });
});