"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { Loader2 } from "lucide-react";
import { fetchProfile } from "@/lib/store/slices/authSlice";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [initialized, setInitialized] = useState(false);

  // ✅ Restore session from localStorage
  useEffect(() => {
    dispatch(fetchProfile()).finally(() => setInitialized(true));
  }, [dispatch]);

  // ✅ Redirect unauthenticated users
  useEffect(() => {
    if (initialized && !isLoading && !isAuthenticated) {
      router.replace("/"); // Use replace to prevent back button issues
    }
  }, [initialized, isAuthenticated, isLoading, router]);

  if (!initialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-900 dark:text-slate-50" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
