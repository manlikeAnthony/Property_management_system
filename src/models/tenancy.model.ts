import { Schema, model, Document, Types } from "mongoose";

export type TenancyStatus = "ACTIVE" | "TERMINATED" | "EXPIRED";

export interface TenancyDocument extends Document {
  property: Types.ObjectId;
  tenant: Types.ObjectId;
  landlord: Types.ObjectId;

  rentAmount: number;
  currency: string;

  startDate: Date;
  endDate?: Date;

  status: TenancyStatus;

  createdAt: Date;
  updatedAt: Date;
}

const TenancySchema = new Schema<TenancyDocument>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    tenant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    landlord: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rentAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      default: "NGN",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: Date,

    status: {
      type: String,
      enum: ["ACTIVE", "TERMINATED", "EXPIRED"],
      default: "ACTIVE",
      index: true,
    },
  },
  { timestamps: true }
);

export const Tenancy = model<TenancyDocument>("Tenancy", TenancySchema);
export default Tenancy;