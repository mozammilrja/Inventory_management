"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { Loader2 } from "lucide-react";
import { fetchProfile } from "@/lib/store/slices/authSlice";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth
  );
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    if (!user) {
      dispatch(fetchProfile()).finally(() => setInitialized(true));
    } else {
      setInitialized(true);
    }
  }, [dispatch]);

  if (!initialized || isLoading) return null; // no loader flicker
  if (!isAuthenticated) return null;

  return <>{children}</>;
};
