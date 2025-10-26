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

  // ✅ Show loader while checking auth
  if (isLoading || !shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-900 dark:text-slate-50" />
      </div>
    );
  }

  return <>{children}</>;
}
