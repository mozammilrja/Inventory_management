"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const { isAuthenticated, token } = useAppSelector((state: any) => state.auth);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    // ✅ verify token present + redux says authenticated
    if (!token || !isAuthenticated) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [token, isAuthenticated, router]);

  if (!ready) return null;

  return <>{children}</>;
};
