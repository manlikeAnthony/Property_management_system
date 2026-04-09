import { Schema, model, Document, Types } from "mongoose";

export interface OwnershipDocument extends Document {
  property: Types.ObjectId;
  owner: Types.ObjectId;
  acquiredAt: Date;
  disposedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OwnershipSchema = new Schema<OwnershipDocument>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    acquiredAt: {
      type: Date,
      default: Date.now,
    },
    disposedAt: Date,
  },
  { timestamps: true }
);

export const Ownership = model<OwnershipDocument>("Ownership", OwnershipSchema);
export default Ownership;