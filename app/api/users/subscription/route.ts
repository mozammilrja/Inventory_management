import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { plan, paymentId } = await req.json();

  await User.findOneAndUpdate(
    { email: session.user.email },
    { subscriptionPlan: plan, lastPaymentId: paymentId },
    { new: true }
  );

  return NextResponse.json({ success: true });
}
