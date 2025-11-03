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

// Define a type for the user document
interface UserWithPassword {
  _id: any;
  email: string;
  name: string;
  password: string;
  phone?: string;
  role?: string;
  refreshTokenHash?: string;
  createdAt: Date;
  lastLoginAt?: Date;
  __v: number;
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log("🔄 Login API:", email);

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = (await User.findOne({
      email: email.toLowerCase(),
    }).select("+password +refreshTokenHash")) as unknown as UserWithPassword;

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // ✅ Generate tokens
    const accessToken = signAccessToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const refreshToken = generateRefreshToken();

    // Save hashed refresh token
    const refreshTokenHash = await hashToken(refreshToken);
    await User.findByIdAndUpdate(user._id, {
      refreshTokenHash,
      lastLoginAt: new Date(),
    });

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax" as const,
      path: "/",
    };

    // ✅ Response body format you requested
    const responseData = {
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    };

    const response = NextResponse.json(responseData, { status: 200 });

    response.cookies.set("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_EXPIRES_SECONDS || 15 * 60,
    });

    response.cookies.set("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_EXPIRES_SECONDS || 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
