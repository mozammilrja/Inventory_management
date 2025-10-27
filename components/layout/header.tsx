"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProfile, logout } from "@/lib/store/slices/authSlice";
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
import { Moon, Sun, User, LogOut, Settings, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state:any) => state.auth);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (token && !user) dispatch(fetchProfile());
  }, [dispatch, token, user]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/");
  };

  const cycleTheme = () => {
    const nextTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);
    toast.success(`Switched theme to ${nextTheme}`);
  };

  const getInitials = (name: string) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "?";

  const userName = user?.name || "Guest";
  const userEmail = user?.email || "guest@example.com";
  const userRole = user?.role || "guest@example.com";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Inventory Management
        </h2>

        <div className="flex items-center space-x-4">
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
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
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
