import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type Role = "USER" | "ADMIN" | "LANDLORD";

export type LandlordApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AccountStatus = "ACTIVE" | "SUSPENDED" | "BANNED" | "REVOKED";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;

  roles: Role[];

  avatar?: string;

  accountStatus: AccountStatus;

  landlordProfile?: {
    applicationStatus: LandlordApplicationStatus;
    isActiveLandlord?: boolean;
    businessName?: string;
    logo?: string;
    deactivatedAt?: Date;
    approvedAt?: Date;
    rejectedAt?: Date;
    revokedAt?: Date;
  };

  isVerified: boolean;
  verificationToken?: string;
  verifiedAt?: Date;

  passwordToken?: string;
  passwordTokenExpirationDate?: Date;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    roles: {
      type: [String],
      enum: ["USER", "ADMIN", "LANDLORD"],
      default: ["USER"],
    },

    avatar: String,

    accountStatus: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "BANNED", "REVOKED"],
      default: "ACTIVE",
    },

    landlordProfile: {
      applicationStatus: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
      },
      isActiveLandlord: {
        type: Boolean,
        default: false,
      },

      businessName: String,
      logo: String,
      deactivatedAt: Date,
      approvedAt: Date,
      rejectedAt: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    verifiedAt: Date,

    passwordToken: String,
    passwordTokenExpirationDate: Date,
  },
  { timestamps: true },
);

/**
 * Password hashing
 */
UserSchema.pre<UserDocument>("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Password compare
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<UserDocument>("User", UserSchema);
export default User;
