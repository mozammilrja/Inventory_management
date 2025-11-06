// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import {
  compareToken,
  generateRefreshToken,
  hashToken,
  signAccessToken,
  ACCESS_EXPIRES_SECONDS,
  REFRESH_EXPIRES_SECONDS,
} from "@/lib/auth/utils";

// 🔥 ADD THIS LINE - Force dynamic rendering
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: "No refresh token" },
        { status: 401 }
      );
    }

    await connectDB();

    // Find user with matching refresh token
    // Instead of finding any user with non-null refreshTokenHash,
    // we need to find the specific user that has this refresh token
    const users = await User.find({ refreshTokenHash: { $ne: null } });

    let user = null;
    for (const u of users) {
      if (await compareToken(refreshToken, u.refreshTokenHash!)) {
        user = u;
        break;
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Rotate refresh token: create new refresh token & hash
    const newRefreshToken = generateRefreshToken();
    const newRefreshHash = await hashToken(newRefreshToken);
    user.refreshTokenHash = newRefreshHash;
    await user.save();

    // Sign new access token
    const accessToken = signAccessToken({ id: user._id, email: user.email });

    const res = NextResponse.json(
      { success: true, message: "Token refreshed" },
      { status: 200 }
    );

    const secure = process.env.NODE_ENV === "production";
    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_EXPIRES_SECONDS,
    });

    res.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_EXPIRES_SECONDS,
    });

    return res;
  } catch (error: any) {
    console.error("Refresh Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
