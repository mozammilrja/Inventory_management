import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await User.create({ name, email, password: hashedPassword });

  // generate JWT
  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return NextResponse.json({ token });
}
