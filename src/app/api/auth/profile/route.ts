// app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; // ✅ Import from next/headers
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyAccessToken } from "@/lib/auth/utils";
import { z } from "zod";

// Zod schema for profile update validation
const profileUpdateSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces")
      .optional(),
    phone: z
      .string()
      .regex(/^\+?[\d\s-()]{10,}$/, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")),
    avatar: z
      .string()
      .url("Please enter a valid URL for avatar")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export async function GET(req: NextRequest) {
  try {
    console.log("🔍 GET User Profile API called");

    // ✅ FIXED: Use cookies() from next/headers instead of req.cookies
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    console.log("🍪 Access Token from cookies:", !!accessToken);
    console.log(
      "🔍 All cookies:",
      Array.from(cookieStore.getAll()).map((c) => c.name)
    );

    if (!accessToken) {
      console.log("❌ No access token found in cookies");
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required. Please log in.",
        },
        { status: 401 }
      );
    }

    console.log("🔐 Access token length:", accessToken.length);

    // Verify the access token
    const decoded = verifyAccessToken(accessToken);
    console.log("✅ Token decoded successfully:", !!decoded);

    if (!decoded) {
      console.log("❌ Invalid or expired token");
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired token. Please log in again.",
        },
        { status: 401 }
      );
    }

    console.log("👤 User ID from token:", decoded.id);

    await connectDB();
    console.log("✅ Database connected");

    // Find user by ID from the token (exclude sensitive fields)
    const user = await User.findById(decoded.id).select(
      "-password -refreshTokenHash"
    );
    console.log("✅ User found in database:", !!user);

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

    console.log("✅ User profile retrieved successfully:", {
      id: user._id,
      name: user.name,
      email: user.email,
    });

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role || "user",
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("❌ Get User Profile Error:", error);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token format",
        },
        { status: 401 }
      );
    }

    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        {
          success: false,
          error: "Token expired. Please log in again.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user profile. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    console.log("🔄 UPDATE User Profile API called");

    // ✅ FIXED: Use cookies() from next/headers
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    console.log("🍪 Access Token from cookies:", !!accessToken);

    if (!accessToken) {
      console.log("❌ No access token found");
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
    console.log("✅ Token decoded:", !!decoded);

    if (!decoded) {
      console.log("❌ Invalid or expired token");
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired token. Please log in again.",
        },
        { status: 401 }
      );
    }

    console.log("👤 User ID from token:", decoded.id);

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
      console.log("📦 Request body:", body);
    } catch (parseError) {
      console.log("❌ Invalid JSON in request body");
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data. Please check your input.",
        },
        { status: 400 }
      );
    }

    // Validate request body against schema
    const validationResult = profileUpdateSchema.safeParse(body);
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

    const updateData = validationResult.data;
    console.log("✅ Validated update data:", updateData);

    await connectDB();
    console.log("✅ Database connected");

    // Check if user exists
    const existingUser = await User.findById(decoded.id);
    if (!existingUser) {
      console.log("❌ User not found in database");
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Check for duplicate phone number if phone is being updated
    if (updateData.phone && updateData.phone !== existingUser.phone) {
      const phoneExists = await User.findOne({
        phone: updateData.phone,
        _id: { $ne: decoded.id }, // Exclude current user
      });

      if (phoneExists) {
        console.log("❌ Phone number already in use:", updateData.phone);
        return NextResponse.json(
          {
            success: false,
            error:
              "This phone number is already registered with another account.",
          },
          { status: 409 }
        );
      }
    }

    // Prepare update fields
    const updateFields: any = {};
    if (updateData.name !== undefined)
      updateFields.name = updateData.name.trim();
    if (updateData.phone !== undefined)
      updateFields.phone = updateData.phone.trim() || null;
    if (updateData.avatar !== undefined)
      updateFields.avatar = updateData.avatar.trim() || null;

    console.log("🔄 Updating user with fields:", updateFields);

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      {
        $set: updateFields,
        $currentDate: { updatedAt: true },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -refreshTokenHash");

    if (!updatedUser) {
      console.log("❌ Failed to update user");
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update profile",
        },
        { status: 500 }
      );
    }

    console.log("✅ User profile updated successfully:", {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      updatedFields: Object.keys(updateFields),
    });

    // Return updated user data
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || "",
        role: updatedUser.role || "user",
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("❌ Update User Profile Error:", error);

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

    // Handle MongoDB duplicate key errors
    if (error.code === 11000 || error.code === 11001) {
      const field = Object.keys(error.keyPattern)[0];
      const message =
        field === "phone"
          ? "This phone number is already registered."
          : "Duplicate field value entered.";

      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 409 }
      );
    }

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: messages,
        },
        { status: 400 }
      );
    }

    // Handle JWT errors
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication failed. Please log in again.",
        },
        { status: 401 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update profile. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Optional: Add PATCH method for partial updates
export async function PATCH(req: NextRequest) {
  return PUT(req); // Reuse PUT logic for PATCH
}
