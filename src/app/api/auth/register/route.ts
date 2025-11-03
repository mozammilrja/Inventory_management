import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import {
  signAccessToken,
  generateRefreshToken,
  hashToken,
  ACCESS_EXPIRES_SECONDS,
  REFRESH_EXPIRES_SECONDS,
} from "@/lib/auth/utils";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    // Validation - now phone is required
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, phone, and password are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists with email OR phone
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { success: false, error: "User already exists with this email" },
          { status: 400 }
        );
      }
      if (existingUser.phone === phone) {
        return NextResponse.json(
          {
            success: false,
            error: "User already exists with this phone number",
          },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      phone, // Now required
      password: hashedPassword,
    });

    // Generate tokens
    const accessToken = signAccessToken({ id: user._id, email: user.email });
    const refreshToken = generateRefreshToken();
    const refreshTokenHash = await hashToken(refreshToken);

    // Save refresh token
    user.refreshTokenHash = refreshTokenHash;
    await user.save();

    const secure = process.env.NODE_ENV === "production";
    const response = NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

    // Set cookies
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_EXPIRES_SECONDS,
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_EXPIRES_SECONDS,
    });

    return response;
  } catch (error: any) {
    console.error("Registration Error:", error);

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message =
        field === "email"
          ? "Email already exists"
          : "Phone number already exists";
      return NextResponse.json(
        { success: false, error: message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Registration failed. Try again." },
      { status: 500 }
    );
  }
}
