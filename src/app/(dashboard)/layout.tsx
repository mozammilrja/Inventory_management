"use client";

import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { closeSidebar, openSidebar } from "@/lib/store/slices/uiSlice";
import { Header } from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LayoutErrorFallback } from "@/components/LayoutErrorFallback";
import { ProtectedRoute } from "@/components/auth/protected-route";

// Define proper types for the error boundary fallback
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// Error boundary for sidebar to prevent entire layout from breaking
function SidebarWithErrorBoundary() {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }: ErrorFallbackProps) => (
        <div className="fixed left-0 top-0 h-full w-20 bg-slate-800 dark:bg-slate-900 flex items-center justify-center">
          <div className="text-center p-4">
            <svg
              className="w-6 h-6 text-red-400 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="text-xs text-red-400">Sidebar Error</span>
            <button
              onClick={resetErrorBoundary}
              className="text-xs text-red-300 hover:text-red-100 mt-2"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    >
      <Sidebar />
    </ErrorBoundary>
  );
}

// Error boundary for header
function HeaderWithErrorBoundary() {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }: ErrorFallbackProps) => (
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <span className="text-sm text-red-600 dark:text-red-400">
                Header Error
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetErrorBoundary}
                className="text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-3 py-1 rounded transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => window.location.reload()}
                className="text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 px-3 py-1 rounded transition-colors"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      )}
    >
      <Header />
    </ErrorBoundary>
  );
}

// Main content with error boundary
function MainContentWithErrorBoundary({
  children,
  sidebarOpen,
}: {
  children: React.ReactNode;
  sidebarOpen: boolean;
}) {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }: ErrorFallbackProps) => (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-orange-600 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Content Error
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              There was a problem loading this content.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={resetErrorBoundary}
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )}
    >
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
    </ErrorBoundary>
  );
}

// Layout logic component (separated for better error handling)
function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const hasFetched = useRef(false);
  const hasInitializedSidebar = useRef(false);
  const dispatch = useAppDispatch();

  // Use proper typing for the selector
  const sidebarOpen = useAppSelector(
    (state: { ui: { sidebarOpen: boolean } }) => state.ui.sidebarOpen
  );

  // Initialize sidebar state based on screen size
  useEffect(() => {
    if (!hasInitializedSidebar.current && typeof window !== "undefined") {
      try {
        if (window.innerWidth >= 1024) {
          dispatch(openSidebar());
        } else {
          dispatch(closeSidebar());
        }
        hasInitializedSidebar.current = true;
      } catch (error) {
        console.error("Error initializing sidebar:", error);
      }
    }
  }, [dispatch]);

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      try {
        if (window.innerWidth < 1024 && sidebarOpen) {
          dispatch(closeSidebar());
        }
      } catch (error) {
        console.error("Error handling resize:", error);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch, sidebarOpen]);

  const handleOverlayClick = () => {
    try {
      dispatch(closeSidebar());
    } catch (error) {
      console.error("Error closing sidebar:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar with Error Boundary */}
      <SidebarWithErrorBoundary />

      {/* Main Content Area */}
      <div
        className={`
          min-h-screen flex flex-col transition-all duration-300
          ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}
        `}
      >
        {/* Header with Error Boundary */}
        <HeaderWithErrorBoundary />

        {/* Main Content with Error Boundary */}
        <MainContentWithErrorBoundary sidebarOpen={sidebarOpen}>
          {children}
        </MainContentWithErrorBoundary>
      </div>
    </div>
  );
}

// Main exported component with top-level error boundary
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }: ErrorFallbackProps) => (
        <LayoutErrorFallback error={error} reset={resetErrorBoundary} />
      )}
      onError={(error: Error, errorInfo: React.ErrorInfo) => {
        // Send to your error reporting service
        console.error("Dashboard Layout Error:", error, errorInfo);
      }}
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </ErrorBoundary>
  );
}
