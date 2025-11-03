// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const privateRoutes = [
    "/dashboard",
    "/profile",
    "/products",
    "/users",
    "/razorpay",
  ];

  const publicAuthRoutes = ["/", "/login", "/register", "/forgot-password"];

  const isRoot = pathname === "/";
  const isPrivate = privateRoutes.some((p) => pathname.startsWith(p));
  const isPublic = publicAuthRoutes.some((p) => pathname.startsWith(p));

  // ❌ No token → trying to access private routes
  if (!token && isPrivate) {
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Already logged in → prevent accessing login/register/home
  if (token && (isPublic || isRoot)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    "/products/:path*",
    "/users/:path*",
    "/razorpay/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
