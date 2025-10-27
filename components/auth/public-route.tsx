"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { Loader2 } from "lucide-react";

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // ✅ Already logged in → redirect to dashboard
        router.replace("/dashboard");
      } else {
        // ✅ Allow login/register page to render
        setShouldRender(true);
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return <>{children}</>;
}
