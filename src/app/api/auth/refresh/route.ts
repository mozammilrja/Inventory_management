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

    // find user with non-null refreshTokenHash
    const user = await User.findOne({ refreshTokenHash: { $ne: null } });
    if (!user) {
      // no user matches: token invalid
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // compare provided refresh token against stored hash
    const ok = await compareToken(refreshToken, user.refreshTokenHash!);
    if (!ok) {
      // token mismatch -> remove stored token to be safe
      user.refreshTokenHash = null;
      await user.save();
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // rotate refresh token: create new refresh token & hash
    const newRefreshToken = generateRefreshToken();
    const newRefreshHash = await hashToken(newRefreshToken);
    user.refreshTokenHash = newRefreshHash;
    await user.save();

    // sign new access token
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
