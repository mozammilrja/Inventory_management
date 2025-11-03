import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_EXPIRES = Number(process.env.ACCESS_TOKEN_EXPIRES_IN) || 15 * 60; // seconds
const REFRESH_EXPIRES =
  Number(process.env.REFRESH_TOKEN_EXPIRES_IN) || 7 * 24 * 60 * 60; // seconds

if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

export function signAccessToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: `${ACCESS_EXPIRES}s` });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as any;
}

// generate opaque refresh token
export function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex"); // 128 chars
}

export async function hashToken(token: string) {
  return bcrypt.hash(token, 12);
}

export async function compareToken(token: string, hash: string) {
  return bcrypt.compare(token, hash);
}

export const ACCESS_EXPIRES_SECONDS = ACCESS_EXPIRES;
export const REFRESH_EXPIRES_SECONDS = REFRESH_EXPIRES;
