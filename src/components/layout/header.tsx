"use client";

import { useEffect, useMemo, useCallback, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleSidebar } from "@/lib/store/slices/uiSlice";
import { setUser, logout as reduxLogout } from "@/lib/store/slices/authSlice";
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
import {
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  Monitor,
  Menu,
  Phone,
  Calendar,
  Loader2,
  RefreshCw,
  Shield,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  getCurrentUserService,
  forceLogout,
  logoutService,
} from "@/services/auth/authService";
import Cookies from "js-cookie";

// Map route → page title
const NAV_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Asset Management",
  "/categories": "Categories",
  "/upcoming": "Upcoming",
  "/settings": "Settings",
  "/profile": "Profile",
  "/users": "User Management",
  "/razorpay": "Payments",
};

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();

  // Get user data from Redux store
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(!user);
  const hasFetchedInitialData = useRef(false);

  // Memoized user data calculations
  const { userName, userEmail, userPhone, userRole, userCreatedAt, roleBadge } =
    useMemo(() => {
      const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "Unknown";
        try {
          return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        } catch {
          return "Unknown";
        }
      };

      const getRoleBadge = (role: string) => {
        const roleConfig = {
          admin: {
            class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            label: "ADMIN",
          },
          manager: {
            class:
              "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
            label: "MANAGER",
          },
          user: {
            class:
              "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            label: "USER",
          },
        };

        return roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
      };

      const role = user?.role || "user";
      const badgeConfig = getRoleBadge(role);

      return {
        userName: user?.name || "Guest User",
        userEmail: user?.email || "No email",
        userPhone: user?.phone || "Not provided",
        userRole: role,
        userCreatedAt: formatDate(user?.createdAt),
        roleBadge: badgeConfig,
      };
    }, [user]);

  // Memoized initials calculation
  const userInitials = useMemo(() => {
    if (!user?.name) return "?";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.name]);

  // Memoized page title
  const pageTitle = useMemo(() => {
    const baseTitle = NAV_TITLES[pathname] || "Asset Management";
    return `${baseTitle}`;
  }, [pathname]);

  // ✅ FIXED: Fetch user data with proper dependencies
  const fetchUserData = useCallback(
    async (forceRefresh = false) => {
      if (isRefreshing && !forceRefresh) return;

      try {
        setIsRefreshing(true);
        console.log("🔄 Header: Fetching user data...", { forceRefresh });

        const response:any = await getCurrentUserService(forceRefresh);

        if (response.success && response.user) {
          const userData = {
            id: response.user.id || response.user._id,
            email: response.user.email,
            name: response.user.name,
            phone: response.user.phone || "",
            role: response.user.role || "user",
            avatar: response.user.avatar,
            department: response.user.department,
            createdAt: response.user.createdAt,
            updatedAt: response.user.updatedAt,
          };

          dispatch(setUser(userData));
          localStorage.setItem("user", JSON.stringify(userData));

          if (forceRefresh) {
            toast.success("User data refreshed");
          }
          console.log("✅ Header: User data updated in Redux");
        } else {
          console.warn(
            "⚠️ Header: Failed to fetch user data:",
            response.message
          );
        }
      } catch (error: any) {
        console.error("❌ Header: Error fetching user:", error);

        if (forceRefresh) {
          toast.error(error.message || "Failed to refresh user data");
        }
      } finally {
        setIsRefreshing(false);
        setIsLoading(false);
      }
    },
    [isRefreshing, dispatch]
  );

  // ✅ FIXED: Manual refresh handler
  const handleRefreshUser = useCallback(async () => {
    await fetchUserData(true);
  }, [fetchUserData]);

  // ✅ FIXED: Logout handlers
  const handleLogoutClick = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  const handleCancelLogout = useCallback(() => {
    setShowLogoutConfirm(false);
  }, []);

  const handleConfirmLogout = useCallback(async () => {
    try {
      console.log("🔄 Header: Starting logout process...");
      setIsRefreshing(true);

      // Call logout service (optional - for server-side cleanup)
      try {
        await logoutService();
      } catch (error) {
        console.warn(
          "Logout service call failed, continuing with client cleanup"
        );
      }

      // ✅ CRITICAL: Clear the token cookie that middleware uses
      Cookies.remove("token", { path: "/" });

      // Clear Redux store
      dispatch(reduxLogout());

      // Clear local storage
      localStorage.removeItem("user");

      console.log("✅ Header: Logout completed — redirecting...");

      // Force reload to trigger middleware
      window.location.href = "/";
    } catch (error) {
      console.error("❌ Header: Unexpected error during logout:", error);

      // Fallback: clear everything and redirect
      Cookies.remove("token", { path: "/" });
      dispatch(reduxLogout());
      localStorage.removeItem("user");
      window.location.href = "/";
    } finally {
      setIsRefreshing(false);
      setShowLogoutConfirm(false);
    }
  }, [dispatch]);

  // Memoized theme cycle handler
  const cycleTheme = useCallback(() => {
    const nextTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);
  }, [theme, setTheme]);

  // Memoized sidebar toggle
  const handleSidebarToggle = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  // Memoized navigation handlers
  const handleProfileNavigation = useCallback(() => {
    router.push("/profile");
  }, [router]);

  const handleSettingsNavigation = useCallback(() => {
    router.push("/settings");
  }, [router]);

  useEffect(() => {
    // If we already have user data in Redux, no need to load
    if (user) {
      setIsLoading(false);
      return;
    }

    // Try to load from localStorage as fallback
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        dispatch(setUser(parsedUser));
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
    }

    // Fetch fresh data only once on mount if no user data
    if (!hasFetchedInitialData.current && !user) {
      hasFetchedInitialData.current = true;
      fetchUserData(false);
    }

    // Event listeners for profile updates and auth events
    const handleProfileUpdate = (event: CustomEvent) => {
      console.log("📢 Header: Received profile update event", event.detail);
      if (event.detail?.user) {
        dispatch(setUser(event.detail.user));
        localStorage.setItem("user", JSON.stringify(event.detail.user));
      }
    };

    const handleAuthLogout = () => {
      console.log("🔐 Header: Auth logout event received");
      // ✅ FIXED: Clear the token cookie that middleware uses
      Cookies.remove("token", { path: "/" });
      dispatch(reduxLogout());
      localStorage.removeItem("user");
    };

    // Add event listeners
    window.addEventListener(
      "profileUpdated",
      handleProfileUpdate as EventListener
    );
    window.addEventListener("auth-expired", handleAuthLogout);

    // Cleanup
    return () => {
      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdate as EventListener
      );
      window.removeEventListener("auth-expired", handleAuthLogout);
    };
  }, [user, dispatch, fetchUserData]);

  // Logout Confirmation Dialog Component
  const LogoutConfirmDialog = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
        <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to log out?
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleCancelLogout}
            disabled={isRefreshing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmLogout}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );

  // Show loading state during initial load
  if (isLoading) {
    return (
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" disabled>
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight capitalize">
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" disabled>
              <Loader2 className="h-5 w-5 animate-spin" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* === Left Section === */}
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={handleSidebarToggle}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Dynamic Page Title */}
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
              {pageTitle}
            </h2>
          </div>

          {/* === Right Section === */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={cycleTheme}
              title={`Current theme: ${theme}`}
            >
              {theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Monitor className="h-5 w-5" />
              )}
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0"
                >
                  <Avatar className="h-10 w-10">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={userName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {isRefreshing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          userInitials
                        )}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-2">
                    {/* User Name with refresh indicator */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {userName}
                      </p>
                      {isRefreshing && (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      )}
                    </div>

                    {/* User Email */}
                    <p className="text-xs text-muted-foreground truncate">
                      {userEmail}
                    </p>

                    {/* Phone Number */}
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground truncate">
                        {userPhone}
                      </span>
                    </div>

                    {/* Member Since */}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Joined {userCreatedAt}
                      </span>
                    </div>

                    {/* Role Badge */}
                    <div className="mt-1 flex items-center gap-2">
                      <Shield className="h-3 w-3 text-muted-foreground" />
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleBadge.class}`}
                      >
                        {roleBadge.label}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleProfileNavigation}
                  disabled={isRefreshing}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile & Account</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleSettingsNavigation}
                  disabled={isRefreshing}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleRefreshUser}
                  disabled={isRefreshing}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <span>Refresh Data</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogoutClick}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950"
                  disabled={isRefreshing}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && <LogoutConfirmDialog />}
    </>
  );
}

// Export the dispatch function for other components to use
export const updateHeaderUser = (user: any) => {
  const event = new CustomEvent("profileUpdated", { detail: { user } });
  window.dispatchEvent(event);
};
