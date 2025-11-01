import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";

// 🧩 Get single product by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productData = {
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
    };

    return NextResponse.json(productData);
  } catch (err: any) {
    console.error("Error fetching product:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 🧩 Update product by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      {
        name: body.name,
        assetType: body.assetType,
        serialNumber: body.serialNumber,
        brand: body.brand,
        model: body.model, // ✅ fixed key name (was productModel before)
        sku: body.sku,
        status: body.status,
        condition: body.condition,
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
        category: body.assetType, // map assetType to category
        quantity: body.status === "Available" ? 1 : 0,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productData = {
      id: updatedProduct._id.toString(),
      name: updatedProduct.name,
      assetType: updatedProduct.assetType,
      serialNumber: updatedProduct.serialNumber,
      brand: updatedProduct.brand,
      model: updatedProduct.model,
      sku: updatedProduct.sku,
      status: updatedProduct.status,
      condition: updatedProduct.condition,
      employeeName: updatedProduct.employeeName,
      employeeId: updatedProduct.employeeId,
      employeeEmail: updatedProduct.employeeEmail,
      department: updatedProduct.department,
      assignmentDate: updatedProduct.assignmentDate,
      returnDate: updatedProduct.returnDate,
      purchaseDate: updatedProduct.purchaseDate,
      warrantyExpiry: updatedProduct.warrantyExpiry,
      location: updatedProduct.location,
      price: updatedProduct.price,
      description: updatedProduct.description,
      image: updatedProduct.image,
      notes: updatedProduct.notes,
      category: updatedProduct.category,
      quantity: updatedProduct.quantity,
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt,
    };

    return NextResponse.json(productData);
  } catch (err: any) {
    console.error("Error updating product:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 🧩 Delete product by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(params.id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting product:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
