import mongoose, { Schema, Document, Model } from "mongoose";

// 1️⃣ Define the TypeScript interface for User
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 2️⃣ Create the schema
const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

// 3️⃣ Create or reuse the model in a type-safe way
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

// 4️⃣ Export
export default User;
