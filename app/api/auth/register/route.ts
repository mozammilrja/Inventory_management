import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json(); // ✅ include phone

    await connectDB();

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ Create new user with phone
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // ✅ Return created user details
    return NextResponse.json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
