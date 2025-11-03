// components/forms/password-reset-request-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import {
  passwordResetSchema,
  type PasswordResetFormData,
} from "@/lib/validations/auth";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

// Mock service - replace with your actual API call
const requestPasswordResetService = async (
  email: string
): Promise<{ success: boolean; message?: string }> => {
  // Replace this with your actual API call
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to request password reset");
  }

  return response.json();
};

interface PasswordResetRequestFormProps {
  onBackToLogin?: () => void;
}

export function PasswordResetRequestForm({
  onBackToLogin,
}: PasswordResetRequestFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: PasswordResetFormData) => {
    setIsLoading(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      const result = await requestPasswordResetService(data.email);

      if (result.success) {
        setSuccessMessage(
          "Password reset instructions have been sent to your email."
        );

        toast({
          title: "Success",
          description: "Check your email for reset instructions.",
          variant: "default",
        });
      } else {
        setServerError(result.message || "Failed to send reset instructions");
      }
    } catch (error: any) {
      console.error("Password reset request error:", error);

      // Handle specific error cases
      if (error.message.includes("user not found")) {
        setServerError("No account found with this email address.");
        form.setError("email", {
          message: "No account found with this email address",
        });
      } else if (error.message.includes("too many attempts")) {
        setServerError("Too many reset attempts. Please try again later.");
      } else {
        setServerError(error.message || "An unexpected error occurred");
      }

      toast({
        title: "Error",
        description: error.message || "Failed to request password reset",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you instructions to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Instructions
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={onBackToLogin}
                className="text-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
