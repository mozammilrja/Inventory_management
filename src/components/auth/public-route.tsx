"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { Loader2 } from "lucide-react";

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, token } = useAppSelector((state: any) => state.auth);
  const [shouldRender, setShouldRender] = useState(false);

  console.log("🔐 PublicRoute - Auth state:", {
    isAuthenticated,
    hasToken: !!token,
    tokenLength: token?.length,
  });

  useEffect(() => {
    if (isAuthenticated) {
      console.log(
        "🔄 PublicRoute - User authenticated, redirecting to dashboard"
      );
      router.replace("/dashboard");
    } else {
      console.log(
        "✅ PublicRoute - User not authenticated, showing public content"
      );
      setShouldRender(true);
    }
  }, [isAuthenticated, router]);

  // Show loading state while checking auth
  if (!shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-300" />
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Checking authentication...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
