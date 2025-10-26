"use client";

import { PublicRoute } from "@/components/auth/public-route";
import LoginPageContent from "./Login";

export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginPageContent />
    </PublicRoute>
  );
}
