"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ProductSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
var Product = mongoose_1.models.Product || mongoose_1.default.model("Product", ProductSchema);
exports.default = Product;
