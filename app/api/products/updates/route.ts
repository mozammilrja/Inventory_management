import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";



// 🧩 Update Product / Asset (PUT)
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: updatedProduct._id.toString(),
      ...updatedProduct.toObject(),
    });
  } catch (err: any) {
    console.error("Error updating product:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 🧩 Delete Product / Asset (DELETE)
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully", id });
  } catch (err: any) {
    console.error("Error deleting product:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
