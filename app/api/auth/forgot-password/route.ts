import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token and expiry (1 hour from now)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // In production, you would send an email here with the reset link
    // For now, we'll just log it (in development, you can see it in console)
    const resetUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
    }/reset-password?token=${resetToken}`;

    console.log("=".repeat(50));
    console.log("PASSWORD RESET REQUEST");
    console.log("=".repeat(50));
    console.log("Email:", email);
    console.log("Reset URL:", resetUrl);
    console.log("Token expires in: 1 hour");
    console.log("=".repeat(50));

    // TODO: Send email with reset link
    // await sendEmail({
    //   to: user.email,
    //   subject: "Password Reset Request",
    //   html: `Click here to reset your password: ${resetUrl}`
    // });

    return NextResponse.json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
      // In development, include the token for testing
      ...(process.env.NODE_ENV === "development" && { resetToken, resetUrl }),
    });
  } catch (err: any) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
