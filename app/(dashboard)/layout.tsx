"use client";

import React, { useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchProductsAsync } from "@/lib/store/slices/productSlice";

// ✅ Lazy imports
const Sidebar = dynamic(
  () => import("@/components/layout/sidebar").then((mod) => mod.Sidebar),
  {
    loading: () => (
      <div className="w-20 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse h-6 w-6 bg-slate-300 dark:bg-slate-700 rounded-full" />
      </div>
    ),
    ssr: false,
  }
);

const Header = dynamic(
  () => import("@/components/layout/header").then((mod) => mod.Header),
  {
    loading: () => (
      <div className="h-16 bg-slate-100 dark:bg-slate-800 animate-pulse" />
    ),
    ssr: false,
  }
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasFetched = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchProductsAsync());
      hasFetched.current = true;
    }
  }, [dispatch]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* ✅ Lazy Sidebar */}
        <Sidebar />

        {/* ✅ Main Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
