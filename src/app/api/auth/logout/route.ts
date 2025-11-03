// app/api/auth/logout/route.ts - ALTERNATIVE METHOD
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("🔄 Logout API called - Alternative method");

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Method 1: Set empty value with past expiration
    response.cookies.set({
      name: "accessToken",
      value: "",
      expires: new Date(0), // Expire immediately
      path: "/",
    });

    response.cookies.set({
      name: "refreshToken",
      value: "",
      expires: new Date(0),
      path: "/",
    });

    // Method 2: Also try deleting the cookies
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    console.log("✅ Cookies cleared using alternative method");
    return response;
  } catch (error) {
    console.error("❌ Logout API error:", error);

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Fallback: Try multiple methods
    response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  }
}
