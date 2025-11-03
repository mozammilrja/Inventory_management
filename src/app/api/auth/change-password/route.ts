// src/app/api/auth/change-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyAccessToken } from "@/lib/auth/utils";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Enhanced password validation schema
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      )
      .refine(
        (password) => !password.includes(" "),
        "Password must not contain spaces"
      ),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export async function PUT(req: NextRequest) {
  try {
    console.log("🔐 Change Password API called");

    // Get access token from cookies
    const accessToken = req.cookies.get("accessToken")?.value;
    console.log("Access token exists:", !!accessToken);

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required. Please log in.",
        },
        { status: 401 }
      );
    }

    // Verify the access token
    const decoded = verifyAccessToken(accessToken);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired token. Please log in again.",
        },
        { status: 401 }
      );
    }

    console.log("👤 User ID from token:", decoded.id);

    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log("📦 Change password request received");
    } catch (parseError) {
      console.log("❌ Invalid JSON in request body");
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = body;

    // Validate request body
    const validationResult = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
    });

    if (!validationResult.success) {
      console.log("❌ Validation failed:", validationResult.error.errors);
      const firstError = validationResult.error.errors[0];
      return NextResponse.json(
        {
          success: false,
          error: firstError?.message || "Invalid input data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    await connectDB();
    console.log("✅ Database connected");

    // Find user WITH password field for verification
    const user:any = await User.findById(decoded.id).select("+password");
    if (!user) {
      console.log("❌ User not found in database");
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Verify current password
    console.log("🔑 Verifying current password...");
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      console.log("❌ Current password is incorrect");
      return NextResponse.json(
        {
          success: false,
          error: "Your current password is incorrect. Please try again.",
        },
        { status: 400 }
      );
    }

    // Check if new password is the same as any of the last 3 passwords
    if (user.previousPasswords) {
      const isRecentlyUsed = await Promise.all(
        user.previousPasswords.slice(0, 3).map(async (oldHash: string) => {
          return await bcrypt.compare(newPassword, oldHash);
        })
      );

      if (isRecentlyUsed.some((isMatch) => isMatch)) {
        console.log("❌ New password was recently used");
        return NextResponse.json(
          {
            success: false,
            error:
              "You have recently used this password. Please choose a different one.",
          },
          { status: 400 }
        );
      }
    }

    // Hash new password
    console.log("🔒 Hashing new password...");
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and maintain password history
    const previousPasswords = user.previousPasswords || [];
    previousPasswords.unshift(user.password);

    // Keep only last 5 passwords
    if (previousPasswords.length > 5) {
      previousPasswords.pop();
    }

    user.password = hashedNewPassword;
    user.previousPasswords = previousPasswords;
    user.passwordChangedAt = new Date();
    user.updatedAt = new Date();

    await user.save();

    console.log("✅ Password changed successfully for user:", user.email);

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error:any) {
    console.error("❌ Change Password Error:", error);

    // Handle specific error types
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle bcrypt errors
    if (error.message?.includes("data and salt arguments required")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password format",
        },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: "Failed to change password. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Add to your User model to support password history:
/*
const userSchema = new mongoose.Schema({
  // ... other fields ...
  previousPasswords: [{
    type: String,
    select: false
  }],
  passwordChangedAt: Date
}, {
  timestamps: true
});
*/
