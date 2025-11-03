import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string; // Make optional in interface
  password: string;
  role: string;
  refreshTokenHash?: string | null;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: {
      type: String,
      required: false, // Change to false
      unique: false, // Remove unique constraint or keep with sparse index
      sparse: true, // Allows multiple null/empty values
    },
    password: { type: String, required: true },
    role: { type: String, default: "Admin" },
    refreshTokenHash: { type: String, default: null },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;