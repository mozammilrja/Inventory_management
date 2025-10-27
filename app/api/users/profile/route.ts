import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req: Request) {
  try {
    // 🔐 Check Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 🧾 Extract token
    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    await connectDB();

    // 🧑 Fetch user data (exclude password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // ✅ Return all essential fields including phone
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || "Admin",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err: any) {
    console.error("Profile fetch error:", err.message);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
