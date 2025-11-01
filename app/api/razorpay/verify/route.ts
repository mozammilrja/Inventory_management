import crypto from "crypto";
import { NextResponse } from "next/server";
import Payment from "@/models/payment.model";
import { connectDB } from "@/lib/mongodb";

interface RazorpayVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  amount?: number;
  currency?: string;
  planName?: string;
  userEmail?: string;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = (await req.json()) as RazorpayVerifyRequest;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount = 0,
      currency = "INR",
      planName = "Unknown Plan",
      userEmail,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment details" },
        { status: 400 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // ✅ Save payment in MongoDB
    const payment = await Payment.create({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount,
      currency,
      planName,
      userEmail,
      verified: true,
    });

    return NextResponse.json({
      success: true,
      message: "✅ Payment verified and saved successfully",
      payment,
    });
  } catch (err: any) {
    console.error("Payment verification failed:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
