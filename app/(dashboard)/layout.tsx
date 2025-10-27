"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProductsAsync } from "@/lib/store/slices/productSlice";
import { closeSidebar, openSidebar } from "@/lib/store/slices/uiSlice";

// ✅ Lazy imports
const Sidebar = dynamic(
  () => import("@/components/layout/sidebar").then((mod) => mod.Sidebar),
  {
    loading: () => (
      <div className="fixed inset-y-0 left-0 w-20 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50">
        <div className="flex items-center justify-center h-16">
          <div className="animate-pulse h-8 w-8 bg-slate-300 dark:bg-slate-700 rounded" />
        </div>
      </div>
    ),
    ssr: false,
  }
);

const Header = dynamic(
  () => import("@/components/layout/header").then((mod) => mod.Header), 
  {
    loading: () => (
      <div className="h-16 bg-white dark:bg-slate-800 border-b animate-pulse" />
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
  const hasInitializedSidebar = useRef(false);
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  // Fetch products once
  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchProductsAsync());
      hasFetched.current = true;
    }
  }, [dispatch]);

  // Initialize sidebar state based on screen size
  useEffect(() => {
    if (!hasInitializedSidebar.current) {
      if (window.innerWidth >= 1024) {
        dispatch(openSidebar());
      } else {
        dispatch(closeSidebar());
      }
      hasInitializedSidebar.current = true;
    }
  }, [dispatch]);

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && sidebarOpen) {
        dispatch(closeSidebar());
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch, sidebarOpen]);

  const handleOverlayClick = () => {
    dispatch(closeSidebar());
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* ✅ Mobile Overlay - only visible on mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
        )}

        {/* ✅ Sidebar - Fixed position */}
        <Sidebar />

        {/* ✅ Main Area - Has left margin to account for sidebar */}
        <div 
          className={`
            min-h-screen flex flex-col transition-all duration-300
            ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
          `}
        >
          <Header />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}