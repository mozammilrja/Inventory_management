// app/register/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Loader2, Eye, EyeOff, Package } from "lucide-react";
import { toast } from "sonner";
import { registerService } from "@/services/auth/authService";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  registerStart,
  registerSuccess,
  registerFailure,
  clearRegisterStatus,
} from "@/lib/store/slices/authSlice";

// Zod validation schema
const RegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get state from Redux
  const {
    isRegistering,
    error,
    registerSuccess: registerSuccessState,
  } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  // Clear registration status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearRegisterStatus());
    };
  }, [dispatch]);

  // Handle successful registration redirect
  useEffect(() => {
    if (registerSuccessState) {
      toast.success("Account created successfully! Redirecting...");
      const timer = setTimeout(() => {
        console.log("🚀 [REGISTER] Redirecting to dashboard");
        router.push("/dashboard");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [registerSuccessState, router]);

  // Handle Redux errors
  useEffect(() => {
    if (error) {
      setLocalError(error);
      toast.error(error);
    }
  }, [error]);

  const handleRegister = async (data: RegisterFormData) => {
    setLocalError("");
    dispatch(clearRegisterStatus());
    dispatch(registerStart());

    console.log("🔄 [REGISTER] Starting registration process...", {
      email: data.email,
      name: data.name,
      phone: data.phone,
    });

    try {
      const res: any = await registerService({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        password: data.password,
      });

      console.log("📥 [REGISTER] Registration service response:", {
        success: res?.success,
        hasUser: !!res?.user,
        message: res?.message,
        error: res?.error,
      });

      if (!res?.success) {
        const errorMsg = res?.error || "Registration failed";
        console.error("❌ [REGISTER] Registration failed:", errorMsg);
        dispatch(registerFailure(errorMsg));
        setLocalError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // ✅ UPDATED: Tokens are in HTTP-only cookies, not in response body
      console.log("🎉 [REGISTER] Registration successful, user:", res.user);

      // Dispatch success to Redux - token is null because it's in cookies
      dispatch(
        registerSuccess({
          user: res.user,
          token: res.token, // Just pass the actual token value
        })
      );

      // Store user data in localStorage
      if (res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
        console.log("💾 [REGISTER] User data saved to localStorage");
      }

      // ✅ NO NEED to manually set token cookie - backend sets HTTP-only cookies
      console.log(
        "🍪 [REGISTER] Tokens are automatically set in HTTP-only cookies by backend"
      );

      // Reset form on success
      reset();

      console.log("✅ [REGISTER] Registration completed successfully");

      // Show success message (already shown in useEffect, but can show here too)
      toast.success(res.message || "Account created successfully!");
    } catch (error: any) {
      console.error("💥 [REGISTER] Registration error:", error);

      // Extract error message with better debugging
      let serverError = "Registration failed! Try again.";

      if (error?.response?.data?.error) {
        serverError = error.response.data.error;
      } else if (error?.response?.data?.message) {
        serverError = error.response.data.message;
      } else if (error?.message) {
        serverError = error.message;
      }

      console.error("📋 [REGISTER] Error details:", {
        serverError,
        status: error.response?.status,
        data: error.response?.data,
      });

      // Dispatch failure to Redux
      dispatch(registerFailure(serverError));
      setLocalError(serverError);
      toast.error(serverError);
    }
  };

  // Combined loading state
  const isLoading = isSubmitting || isRegistering;

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
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Sign up for your assets management account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(handleRegister)}>
          <CardContent className="space-y-4">
            {/* Success Alert */}
            {registerSuccessState && (
              <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200">
                <AlertDescription>
                  ✅ Account created successfully! Redirecting to dashboard...
                </AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {localError && (
              <Alert variant="destructive">
                <AlertDescription>❌ {localError}</AlertDescription>
              </Alert>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
                disabled={isLoading}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                disabled={isLoading}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                placeholder="1234567890"
                {...register("phone")}
                disabled={isLoading}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading}
                  className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  tabIndex={-1}
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  disabled={isLoading}
                  className={`pr-10 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {registerSuccessState
                    ? "Redirecting..."
                    : "Creating Account..."}
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="hover:underline font-medium text-primary"
              onClick={(e) => {
                if (isLoading) {
                  e.preventDefault();
                }
              }}
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
