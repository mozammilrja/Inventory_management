import mongoose, { Schema, Document, models } from "mongoose";

export interface IProduct extends Document {
  // Asset Information
  name: string;
  assetType: string; // Laptop, Monitor, Mouse, etc.
  serialNumber: string; // Unique identifier
  brand: string;
  productModel: string;
  sku: string; // Asset tag

  // Status & Condition
  status: "Available" | "Assigned" | "Under Repair" | "Retired";
  condition: "New" | "Good" | "Fair" | "Poor";

  // Employee Assignment
  employeeName?: string;
  employeeId?: string;
  employeeEmail?: string;
  department?: string;
  assignmentDate?: Date;
  returnDate?: Date;

  // Dates & Warranty
  purchaseDate?: Date;
  warrantyExpiry?: Date;

  // Location & Value
  location?: string;
  price: number;

  // Additional Info
  description: string;
  image?: string;
  notes?: string;

  // Legacy field for backward compatibility
  category: string; // Will map to assetType
  quantity: number; // Will represent availability (0 or 1)

  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    // Asset Information
    name: { type: String, required: true, minlength: 3 },
    assetType: { type: String, default: "Other" }, // Optional for backward compatibility
    serialNumber: { type: String, sparse: true }, // Sparse index allows null/undefined
    brand: { type: String, default: "Unknown" }, // Optional for backward compatibility
    productModel: { type: String, default: "N/A" }, // Optional for backward compatibility
    sku: { type: String, required: true },

    // Status & Condition
    status: {
      type: String,
      enum: ["Available", "Assigned", "Under Repair", "Retired"],
      default: "Available",
      required: true
    },
    condition: {
      type: String,
      enum: ["New", "Good", "Fair", "Poor"],
      default: "Good",
      required: true
    },

    // Employee Assignment
    employeeName: { type: String },
    employeeId: { type: String },
    employeeEmail: { type: String },
    department: { type: String },
    assignmentDate: { type: Date },
    returnDate: { type: Date },

    // Dates & Warranty
    purchaseDate: { type: Date },
    warrantyExpiry: { type: Date },

    // Location & Value
    location: { type: String },
    price: { type: Number, required: true, min: 0 },

    // Additional Info
    description: { type: String, required: true, minlength: 10 },
    image: { type: String },
    notes: { type: String },

    // Legacy fields
    category: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 0 },
  },
  { timestamps: true }
);

const Product =
  models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
