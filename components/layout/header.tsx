"use client";

import { useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProfile, logout } from "@/lib/store/slices/authSlice";
import { toggleSidebar } from "@/lib/store/slices/uiSlice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Moon, Sun, User, LogOut, Settings, Monitor, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

// Map route → page title
const NAV_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/categories": "Categories",
  "/upcoming": "Upcoming",
  "/settings": "Settings",
  "/profile": "Profile",
};

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state: any) => state.auth);
  const { theme, setTheme } = useTheme();

  // Fetch profile if logged in
  useEffect(() => {
    if (token && !user) dispatch(fetchProfile());
  }, [dispatch, token, user]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/");
  };

  // Cycle through light → dark → system
  const cycleTheme = () => {
    const nextTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);
    toast.success(`Switched to ${nextTheme} mode`);
  };

  // Extract user initials
  const getInitials = (name: string) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "?";

  // Determine page title based on route
  const pageTitle = useMemo(() => {
  return ` ${NAV_TITLES[pathname] ? `${NAV_TITLES[pathname]} Assets` : "Assets Management"}`;
  }, [pathname]);

  const userName = user?.name || "Guest";
  const userEmail = user?.email || "guest@example.com";
  const userRole = user?.role || "guest";

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* === Left Section === */}
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => dispatch(toggleSidebar())}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Dynamic Page Title */}
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight capitalize">
            Assets Management
          </h2>
        </div>

        {/* === Right Section === */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={cycleTheme}>
            {theme === "system" ? (
              <Monitor className="h-5 w-5" />
            ) : (
              <>
                <Sun className="h-5 w-5 dark:hidden" />
                <Moon className="hidden dark:block h-5 w-5" />
              </>
            )}
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar>
                  <AvatarFallback className="bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Role: <span className="capitalize">{userRole}</span>
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}