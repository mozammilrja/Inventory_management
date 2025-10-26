import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// Get Products with Search and Filtering
export async function GET(req: Request) {
  try {
    await connectDB();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const department = searchParams.get("department") || "";
    const assetType = searchParams.get("assetType") || "";
    const status = searchParams.get("status") || "";
    const condition = searchParams.get("condition") || "";

    // Build filter query
    const filter: any = {};

    // Search across multiple fields
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { serialNumber: { $regex: search, $options: "i" } },
        { employeeName: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by department
    if (department) {
      filter.department = department;
    }

    // Filter by asset type
    if (assetType) {
      filter.assetType = assetType;
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by condition
    if (condition) {
      filter.condition = condition;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    // Convert MongoDB documents to plain objects with all fields
    const productsData = products.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      assetType: product.assetType,
      serialNumber: product.serialNumber,
      brand: product.brand,
      model: product.model,
      sku: product.sku,
      status: product.status,
      condition: product.condition,
      employeeName: product.employeeName,
      employeeId: product.employeeId,
      employeeEmail: product.employeeEmail,
      department: product.department,
      assignmentDate: product.assignmentDate,
      returnDate: product.returnDate,
      purchaseDate: product.purchaseDate,
      warrantyExpiry: product.warrantyExpiry,
      location: product.location,
      price: product.price,
      description: product.description,
      image: product.image,
      notes: product.notes,
      category: product.category,
      quantity: product.quantity,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return NextResponse.json(productsData);
  } catch (err: any) {
    console.error("Error fetching products:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Add Product/Asset
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.assetType) {
      return NextResponse.json(
        { error: "Name and asset type are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const newProduct = await Product.create({
      name: body.name,
      assetType: body.assetType,
      serialNumber: body.serialNumber,
      brand: body.brand,
      model: body.model,
      sku: body.sku,
      status: body.status || "Available",
      condition: body.condition || "Good",
      employeeName: body.employeeName,
      employeeId: body.employeeId,
      employeeEmail: body.employeeEmail,
      department: body.department,
      assignmentDate: body.assignmentDate,
      returnDate: body.returnDate,
      purchaseDate: body.purchaseDate,
      warrantyExpiry: body.warrantyExpiry,
      location: body.location,
      price: body.price,
      description: body.description,
      image: body.image,
      notes: body.notes,
      category: body.assetType, // Map assetType to category for backward compatibility
      quantity: body.status === "Available" ? 1 : 0,
    });

    // Return product with all fields
    const productData = {
      id: newProduct._id.toString(),
      name: newProduct.name,
      assetType: newProduct.assetType,
      serialNumber: newProduct.serialNumber,
      brand: newProduct.brand,
      model: newProduct.model,
      sku: newProduct.sku,
      status: newProduct.status,
      condition: newProduct.condition,
      employeeName: newProduct.employeeName,
      employeeId: newProduct.employeeId,
      employeeEmail: newProduct.employeeEmail,
      department: newProduct.department,
      assignmentDate: newProduct.assignmentDate,
      returnDate: newProduct.returnDate,
      purchaseDate: newProduct.purchaseDate,
      warrantyExpiry: newProduct.warrantyExpiry,
      location: newProduct.location,
      price: newProduct.price,
      description: newProduct.description,
      image: newProduct.image,
      notes: newProduct.notes,
      category: newProduct.category,
      quantity: newProduct.quantity,
      createdAt: newProduct.createdAt,
      updatedAt: newProduct.updatedAt,
    };

    return NextResponse.json(productData);
  } catch (err: any) {
    console.error("Error creating product:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
