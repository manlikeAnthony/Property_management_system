import { Schema, model, Document, Types } from "mongoose";

export type TransactionType = "BUY" | "RENT";

export interface TransactionDocument extends Document {
  property: Types.ObjectId;
  buyer: Types.ObjectId;
  seller: Types.ObjectId;
  amount: number;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<TransactionDocument>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["BUY", "RENT"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Transaction = model<TransactionDocument>(
  "Transaction",
  TransactionSchema
);
export default Transaction;