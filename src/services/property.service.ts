import Property from "../models/property.model";
import { CustomError } from "../errors/CustomError";
import { HttpCodes } from "../errors/HttpCodes";
import { AppCodes } from "../errors/AppCodes";
import User from "../models/user.model";
import { S3StorageService } from "./s3.service";
export const createPropertyService = async (data: any, user: any) => {
  const userRecord = await User.findById(user.userId).populate(
    "landlordProfile",
  );

  if (!userRecord) {
    CustomError.throwError(
      HttpCodes.UNAUTHORIZED,
      AppCodes.AUTH_UNAUTHORIZED,
      "User not found",
    );
  }

  if (userRecord.accountStatus !== "ACTIVE") {
    CustomError.throwError(
      HttpCodes.FORBIDDEN,
      AppCodes.USER_INACTIVE,
      "User account is not active",
    );
  }

  const isAdmin = userRecord.roles.includes("ADMIN");

  const isApprovedLandlord =
    userRecord.roles.includes("LANDLORD") &&
    userRecord.landlordProfile?.applicationStatus === "APPROVED";

  if (!isAdmin && !isApprovedLandlord) {
    CustomError.throwError(
      HttpCodes.FORBIDDEN,
      AppCodes.AUTH_UNAUTHORIZED,
      "Not authorized to create property",
    );
  }

  if (!userRecord.accountStatus || userRecord.accountStatus !== "ACTIVE") {
    CustomError.throwError(
      HttpCodes.FORBIDDEN,
      AppCodes.USER_INACTIVE,
      "User account is not active",
    );
  }

  const {
    title,
    description,
    price,
    type,
    address,
    // location, till i add geocoding
    bedrooms,
    bathrooms,
    area,
    images,
  } = data;

  if (
    !title ||
    !price ||
    !type ||
    !address?.street ||
    !address?.city ||
    !address?.state
  ) {
    CustomError.throwError(
      HttpCodes.BAD_REQUEST,
      AppCodes.MISSING_REQUIRED_FIELD,
      "Missing required property fields",
    );
  }
  const formattedAddress = [address?.street, address?.city, address?.state]
    .filter(Boolean)
    .join(", ");

  const property = await Property.create({
    title,
    description,
    price,
    type,
    address,
    // location, till i add geocoding
    formattedAddress,
    bedrooms,
    bathrooms,
    area,
    owner: userRecord._id,
    listedBy: userRecord._id,
    images: images || [],
    isPublished: false,
  });

  return property;
};

export const getAllPropertiesService = async () => {
  const properties = await Property.find();
  return properties;
};

export const getPropertyByIdService = async (propertyId: string) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.PROPERTY_NOT_FOUND,
      "Property not found",
    );
  }
  return property;
};

export const deletePropertyService = async (propertyId: string, user: any) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.PROPERTY_NOT_FOUND,
      "Property not found",
    );
  }
  if (
    property.owner.toString() !== user.userId &&
    !user.roles.includes("ADMIN")
  ) {
    CustomError.throwError(
      HttpCodes.FORBIDDEN,
      AppCodes.AUTH_UNAUTHORIZED,
      "Not authorized to delete this property",
    );
  }
  const storageService = new S3StorageService();

  if (property.images && property.images.length > 0) {
    await Promise.all(
     property.images.map((image)=> storageService.delete(image.url)
      ),
    );
  }
  await property.deleteOne();
  return;
};

export const updatePropertyService = async (
  propertyId: string,
  data: any,
  user: any,
  files?: Express.Multer.File[],
) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    CustomError.throwError(
      HttpCodes.NOT_FOUND,
      AppCodes.PROPERTY_NOT_FOUND,
      "Property not found",
    );
  }
  if (
    property.owner.toString() !== user.userId &&
    !user.roles.includes("ADMIN")
  ) {
    CustomError.throwError(
      HttpCodes.FORBIDDEN,
      AppCodes.AUTH_UNAUTHORIZED,
      "Not authorized to update this property",
    );
  }
  const storageService = new S3StorageService();
  // remove images if requested
  if (data.imagesToRemove?.length) {
    await Promise.all(
      data.imagesToRemove.map((key: string) =>
        storageService.delete(
          `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        ),
      ),
    );

    property.images = property.images.filter(
      (image)=> !data.imagesToRemove.includes(image.key)
    )
  }

  // add new images if provided

  if(files && files.length > 0){
    const uploaded = await Promise.all(
      files.map((file)=> storageService.upload(file, "properties"))
    )
    property.images.push(...uploaded)
  }
  delete data.imagesToRemove; // remove this field from data so it doesn't get set on the property
  const allowedFields = [
    "title",
    "description",
    "price",
    "type",
    "address",
    "bedrooms",
    "bathrooms",
    "area"
  ];

  allowedFields.forEach((field)=>{
    if(data[field] !== undefined){
      (property as any)[field] = data[field];
    }
  })

  await property.save();

  return property;
};

export const getUserRentedPropertiesService = async (userId: string) => {
  const properties = await Property.find({ "tenants.userId": userId });
  return properties;
};

export const getMyListedPropertiesService = async (userId: string) => {
  const properties = await Property.find({ owner: userId });
  return properties;
};

export const getAllPropertiesOnSaleService = async () => {
  // pointless btw, we can just use getAllPropertiesByType with type = SALE
  const properties = await Property.find({ isPublished: true, type: "SALE" });
  return properties;
};

export const getAllPropertiesForRentService = async () => {
  // pointless btw, we can just use getAllPropertiesByType with type = RENT, still left it tho because it might be useful for future features like filtering by sale/rent
  const properties = await Property.find({ isPublished: true, type: "RENT" });
  return properties;
};

export const getAllPropertiesByTypeService = async (type: string) => {
  const properties = await Property.find({ isPublished: true, type });
  return properties;
};

export const getAllPropertiesByLocationService = async (location: string) => {
  const properties = await Property.find({
    isPublished: true,
    "location.city": location,
  });
  return properties;
};
