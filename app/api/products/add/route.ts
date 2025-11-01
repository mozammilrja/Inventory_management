import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// 🧩 Add Product / Asset
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
      category: body.assetType,
      quantity: body.status === "Available" ? 1 : 0,
    });

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
