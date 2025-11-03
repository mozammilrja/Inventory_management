"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  LayoutDashboard,
  Box,
  Tag,
  Settings,
  ChevronLeft,
  ChevronRight,
  Rocket,
  X,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleSidebar, closeSidebar } from "@/lib/store/slices/uiSlice";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Box },
  { name: "Add Product", href: "/products/new", icon: PlusCircle },
  { name: "Categories", href: "/categories", icon: Tag },
  { name: "Upcoming", href: "/upcoming", icon: Rocket },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  // ✅ Changed to default export
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  const handleLinkClick = () => {
    // Close sidebar on mobile when clicking a link
    if (window.innerWidth < 1024) {
      dispatch(closeSidebar());
    }
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out",
        // Mobile: slide in/out
        sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64",
        // Desktop: always visible, controlled width
        "lg:translate-x-0",
        sidebarOpen ? "lg:w-64" : "lg:w-20"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        {sidebarOpen ? (
          <>
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-slate-900 dark:text-white" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                AssetPro
              </span>
            </Link>
            {/* Mobile close button */}
            <button
              onClick={() => dispatch(closeSidebar())}
              className="lg:hidden p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
          </>
        ) : (
          <Link href="/dashboard" className="flex items-center mx-auto">
            <Package className="h-8 w-8 text-slate-900 dark:text-white" />
          </Link>
        )}
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-slate-900 text-white dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white",
                !sidebarOpen && "justify-center"
              )}
            >
              <item.icon
                className={cn("h-5 w-5 flex-shrink-0", sidebarOpen && "mr-3")}
              />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-3 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(toggleSidebar())}
          className={cn(
            "w-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800",
            !sidebarOpen && "justify-center px-0"
          )}
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}