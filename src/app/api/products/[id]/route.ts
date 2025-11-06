import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";

// Cache for single product queries
const productCache = new Map();
const PRODUCT_CACHE_TTL = 30000; // 30 seconds

// Optional: Add force-dynamic if you want to be explicit
// export const dynamic = 'force-dynamic'

// 🧩 GET Single Product by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const productId = params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Check cache
    const cached = productCache.get(productId);
    if (cached && Date.now() - cached.timestamp < PRODUCT_CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productData = {
      id: product._id.toString(),
      name: product.name,
      assetType: product.assetType,
      serialNumber: product.serialNumber,
      brand: product.brand,
      productModel: product.model,
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

    // Cache the response
    productCache.set(productId, {
      data: productData,
      timestamp: Date.now(),
    });

    return NextResponse.json(productData);
  } catch (err: any) {
    console.error("Error fetching product:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 🧩 UPDATE Product by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const productId = params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name: body.name,
        assetType: body.assetType,
        serialNumber: body.serialNumber,
        brand: body.brand,
        model: body.model,
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
        category: body.assetType,
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
      productModel: updatedProduct.model,
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

    // Clear caches
    productCache.delete(productId);

    return NextResponse.json(productData);
  } catch (err: any) {
    console.error("Error updating product:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 🧩 DELETE Product by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const productId = params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Clear caches
    productCache.delete(productId);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      id: productId,
    });
  } catch (err: any) {
    console.error("Error deleting product:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}