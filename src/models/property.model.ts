import { Schema, model, Document, Types } from "mongoose";

export type PropertyStatus = "AVAILABLE" | "SOLD" | "RENTED";
export type PropertyType = "SALE" | "RENT";
const LocationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false },
);

export interface PropertyDocument extends Document {
  title: string;
  description?: string;
  price: number;
  currency: string;

  type: PropertyType;
  status: PropertyStatus;

  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };

  location?: {
    type: "Point";
    coordinates: [number, number];
  };

  formattedAddress?: string;

  bedrooms?: number;
  bathrooms?: number;
  area?: number;

  owner: Types.ObjectId;
  listedBy: Types.ObjectId;

  images: {
    url: string;
    key: string;
  }[];

  isPublished: boolean;
  tenants?: {
    userId: Types.ObjectId;
    createdAt: Date;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<PropertyDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      maxlength: 1000,
    },

    price: {
      type: Number,
      required: true,
      min: 1, // 🔥 prevents nonsense values
    },

    currency: {
      type: String,
      default: "NGN",
    },

    type: {
      type: String,
      enum: ["SALE", "RENT"],
      required: true,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "SOLD", "RENTED"],
      default: "AVAILABLE",
    },

    address: {
      street: { type: String, required: true  , maxlength: 100},
      city: { type: String, required: true , maxlength: 50},
      state: { type: String, required: true , maxlength: 50},
      country: { type: String, default: "Nigeria" },
    },

    location: {
      type: LocationSchema,
      required: false,
    },

    formattedAddress: {
      type: String,
    },

    bedrooms: {
      type: Number,
      min: 0,
    },

    bathrooms: {
      type: Number,
      min: 0,
    },

    area: {
      type: Number,
      min: 0,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    listedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    images: [
      {
        url: { type: String, required: true },
        key: { type: String, required: true },
      },
    ],

    isPublished: {
      type: Boolean,
      default: false,
    },
    tenants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

// PropertySchema.index({ location: "2dsphere" }); til geocoding is added

export const Property = model<PropertyDocument>("Property", PropertySchema);
export default Property;
