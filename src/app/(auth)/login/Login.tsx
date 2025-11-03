// app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { loginService } from "@/services/auth/authService";
import { loginSuccess, loginFailure } from "@/lib/store/slices/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ✅ Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(LoginSchema) });

  // ✅ Check if already authenticated via cookie
  useEffect(() => {
    const token = Cookies.get("token");
    console.log("token", token);
    if (token) {
      const redirectTo = searchParams.get("redirect") || "/dashboard";
      router.replace(redirectTo);
    } else {
      setIsCheckingAuth(false);
    }
  }, [router, searchParams]);
  const onSubmit = async (data: LoginFormData) => {
    setServerError("");
    console.log("🔍 [LOGIN FORM] Starting login process...", {
      email: data.email,
      passwordLength: data.password.length,
    });

    try {
      console.log("📤 [LOGIN FORM] Calling loginService...");
      const response: any = await loginService(data);

      console.log("📥 [LOGIN FORM] Login service response:", {
        success: response?.success,
        hasUser: !!response?.user,
        hasAccessToken: !!response?.accessToken,
        error: response?.error,
        message: response?.message,
        fullResponse: response,
      });

      if (response?.success) {
        console.log("✅ [LOGIN FORM] Login successful!", {
          user: response.user,
          tokenPresent: !!response.accessToken,
        });

        // ✅ Save auth cookie (7 days)
        if (response.accessToken) {
          Cookies.set("token", response.accessToken, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });
          console.log("🍪 [LOGIN FORM] Token saved to cookies");
        } else {
          console.warn("⚠️ [LOGIN FORM] No accessToken in response");
        }

        // Dispatch to Redux
        dispatch(
          loginSuccess({
            user: response.user,
            token: response.accessToken,
          })
        );
        console.log("🔄 [LOGIN FORM] Dispatched to Redux");

        toast.success("Login successful! Redirecting...");

        setTimeout(() => {
          const redirectTo = searchParams.get("redirect") || "/dashboard";
          console.log("🚀 [LOGIN FORM] Redirecting to:", redirectTo);
          router.replace(redirectTo);
        }, 600);
      } else {
        console.error("❌ [LOGIN FORM] Login failed in response:", {
          error: response?.error,
          message: response?.message,
        });

        dispatch(loginFailure(response?.error || "Login failed"));
        setServerError(response?.error || "Invalid credentials");
        toast.error(response?.error || "Login failed");
      }
    } catch (error: any) {
      console.error("💥 [LOGIN FORM] Login error caught:", {
        message: error.message,
        stack: error.stack,
      });

      dispatch(loginFailure(error.message || "Something went wrong"));
      setServerError(error.message || "Something went wrong");
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-slate-900 dark:bg-slate-50 p-3 rounded-lg">
              <Package className="h-8 w-8 text-white dark:text-slate-900" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your assets management account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="admin@example.com"
                disabled={isSubmitting}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="pr-10"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                  in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="flex justify-end text-sm">
              <Link href="/forgot-password" className="hover:underline">
                Forgot password?
              </Link>
            </div>
          </CardContent>
        </form>

        <CardFooter className="flex justify-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
