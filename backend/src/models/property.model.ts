import { Schema, model, Document, Types } from "mongoose";

export type PropertyStatus = "AVAILABLE" | "SOLD" | "RENTED" |"PARTIALLY_OCCUPIED";
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
      validate: {
        validator: function (val: number[]) {
          return val.length === 2;
        },
        message: "Coordinates must be [longitude, latitude]",
      },
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
  maxTenants: number;

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
      street: { type: String, required: true, maxlength: 100 },
      city: { type: String, required: true, maxlength: 50 },
      state: { type: String, required: true, maxlength: 50 },
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
      index: true,
    },

    listedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
      index: true,
    },
    maxTenants: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { timestamps: true },
);

PropertySchema.index({ location: "2dsphere" });
PropertySchema.index({ type: 1, status: 1, createdAt: -1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ createdAt: -1 });
PropertySchema.index({ owner: 1, isPublished: 1 });

PropertySchema.pre("save", function () {
  if (this.type === "SALE" && this.status === "RENTED") {
    throw new Error("SALE property cannot be RENTED");
  }
  if (this.type === "RENT" && this.status === "SOLD") {
    throw new Error("RENT property cannot be SOLD");
  }
});

PropertySchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate() as Partial<PropertyDocument>;

  const docToUpdate = await this.model.findOne(this.getQuery());

  if (!docToUpdate) return;

  const newType = update.type ?? docToUpdate.type;
  const newStatus = update.status ?? docToUpdate.status;

  if (newType === "SALE" && newStatus === "RENTED") {
    throw new Error("SALE property cannot be RENTED");
  }

  if (newType === "RENT" && newStatus === "SOLD") {
    throw new Error("RENT property cannot be SOLD");
  }
});

export const Property = model<PropertyDocument>("Property", PropertySchema);
export default Property;
