"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  getCurrentUserService,
  updateProfileService,
  changePasswordService,
  type User,
} from "@/services/auth/authService";
import {
  User as UserIcon,
  Mail,
  Shield,
  Bell,
  Lock,
  Save,
  Smartphone,
  AlertCircle,
  Loader2,
  Calendar,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Zod Schemas for Validation
const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || /^\+?[\d\s-()]{10,}$/.test(val),
      "Please enter a valid phone number"
    ),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      )
      .refine(
        (password) => !password.includes(" "),
        "Password must not contain spaces"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// Cache user data to avoid refetching
let userCache: User | null = null;

// Enhanced Change Password Component with Zod Validation
function ChangePasswordSection() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid, isDirty },
    reset,
  } = form;

  // Auto-hide messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (serverError) {
      const timer = setTimeout(() => {
        setServerError(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [serverError]);

  const onSubmit = async (data: ChangePasswordFormData) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const response = await changePasswordService({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.success) {
        setSuccessMessage("Password changed successfully!");
        reset();

        toast.success("🎉 Password changed successfully!", {
          description: "Your password has been updated securely",
        });
      } else {
        throw new Error(response.message || "Failed to change password");
      }
    } catch (error: any) {
      console.error("Change password error:", error);

      let errorMessage = error.message || "Failed to change password";

      if (error.message?.includes("current password is incorrect")) {
        errorMessage = "Your current password is incorrect.";
        form.setError("currentPassword", { message: errorMessage });
      } else if (error.message?.includes("same as current")) {
        errorMessage = "New password must be different from current password.";
        form.setError("newPassword", { message: errorMessage });
      } else if (error.message?.includes("recently used")) {
        errorMessage =
          "You have recently used this password. Please choose a different one.";
        form.setError("newPassword", { message: errorMessage });
      } else if (error.message?.includes("Session expired")) {
        errorMessage = "Your session has expired. Please log in again.";
      }

      setServerError(errorMessage);

      toast.error(errorMessage, {
        description: "Please check your current password and try again",
      });
    }
  };

  const dismissSuccess = () => setSuccessMessage(null);
  const dismissError = () => setServerError(null);

  const PasswordInput = ({
    field,
    showPassword,
    setShowPassword,
    placeholder,
    disabled = false,
  }: any) => (
    <div className="relative">
      <FormControl>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10"
          {...field}
        />
      </FormControl>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  );

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Server Messages */}
            {serverError && (
              <Alert variant="destructive" className="relative">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{serverError}</AlertDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6"
                  onClick={dismissError}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Alert>
            )}

            {successMessage && (
              <Alert className="bg-green-50 border-green-200 relative">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {successMessage}
                </AlertDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6"
                  onClick={dismissSuccess}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Current Password
                  </FormLabel>
                  <PasswordInput
                    field={field}
                    showPassword={showCurrentPassword}
                    setShowPassword={setShowCurrentPassword}
                    placeholder="Enter current password"
                    disabled={isSubmitting}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    New Password
                  </FormLabel>
                  <PasswordInput
                    field={field}
                    showPassword={showNewPassword}
                    setShowPassword={setShowNewPassword}
                    placeholder="Enter new password"
                    disabled={isSubmitting}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Confirm New Password
                  </FormLabel>
                  <PasswordInput
                    field={field}
                    showPassword={showConfirmPassword}
                    setShowPassword={setShowConfirmPassword}
                    placeholder="Confirm new password"
                    disabled={isSubmitting}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Password Requirements
                  </p>
                  <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Include uppercase and lowercase letters</li>
                    <li>• Include at least one number</li>
                    <li>• Include at least one special character</li>
                    <li>• No spaces allowed</li>
                    <li>• Different from current password</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !isValid || !isDirty}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Profile Form Component with Zod Validation
function ProfileForm({
  user,
  onProfileUpdate,
}: {
  user: User;
  onProfileUpdate: (user: User) => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty, isValid },
    reset,
  } = form;

  // Auto-hide messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (serverError) {
      const timer = setTimeout(() => {
        setServerError(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [serverError]);

  // Reset form when user changes
  useEffect(() => {
    reset({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const response = await updateProfileService({
        name: data.name.trim(),
        phone: data.phone?.trim() || "",
      });

      if (response.success && response.user) {
        setSuccessMessage("Profile updated successfully!");
        onProfileUpdate(response.user);

        toast.success("✅ Profile updated successfully!", {
          description: "Your profile information has been saved",
        });

        // Reset form state to clean
        reset({
          name: response.user.name || "",
          email: response.user.email || "",
          phone: response.user.phone || "",
        });
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Profile update error:", error);

      let errorMessage = error.message || "Failed to update profile";

      if (error.message?.includes("email already exists")) {
        errorMessage = "This email address is already in use.";
        form.setError("email", { message: errorMessage });
      } else if (error.message?.includes("Session expired")) {
        errorMessage = "Your session has expired. Please log in again.";
      } else if (error.message?.includes("phone number")) {
        errorMessage = "This phone number is already registered.";
        form.setError("phone", { message: errorMessage });
      }

      setServerError(errorMessage);

      toast.error(errorMessage, {
        description: "Please check your information and try again",
      });
    }
  };

  const dismissSuccess = () => setSuccessMessage(null);
  const dismissError = () => setServerError(null);

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Unknown";
    }
  };

  return (
    <Card className="border-0 shadow-lg shadow-primary/5 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <UserIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Profile Information</CardTitle>
            <CardDescription>
              Manage your personal account details
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Profile Summary */}
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold truncate">{user.name}</h3>
            <p className="text-sm text-muted-foreground truncate flex items-center gap-2 mt-1">
              <Mail className="h-3 w-3" />
              {user.email}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="capitalize">
                <Shield className="h-3 w-3 mr-1" />
                {user.role || "user"}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Joined {formatDate(user.createdAt)}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Server Messages */}
        {serverError && (
          <Alert variant="destructive" className="relative">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{serverError}</AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={dismissError}
            >
              <X className="h-3 w-3" />
            </Button>
          </Alert>
        )}

        {successMessage && (
          <Alert className="bg-green-50 border-green-200 relative">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={dismissSuccess}
            >
              <X className="h-3 w-3" />
            </Button>
          </Alert>
        )}

        {/* Profile Form */}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Full Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      disabled
                      className="opacity-70 cursor-not-allowed bg-muted/50"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed for security reasons
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting || !isDirty || !isValid}
              className="w-full gap-2"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile Changes
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Notification Settings Component
function NotificationSettings() {
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Notification states
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [maintenanceNotifications, setMaintenanceNotifications] =
    useState(false);

  // Load notification preferences from localStorage on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem("notificationPreferences");
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        setLowStockAlerts(preferences.lowStockAlerts ?? true);
        setEmailNotifications(preferences.emailNotifications ?? true);
        setProductUpdates(preferences.productUpdates ?? false);
        setSecurityAlerts(preferences.securityAlerts ?? true);
        setMaintenanceNotifications(
          preferences.maintenanceNotifications ?? false
        );
      } catch (error) {
        console.error("Error loading notification preferences:", error);
      }
    }
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const handleSaveNotifications = async () => {
    setNotificationSaving(true);
    setSaveSuccess(false);

    try {
      // Save notification preferences to localStorage or API
      const notificationPreferences = {
        lowStockAlerts,
        emailNotifications,
        productUpdates,
        securityAlerts,
        maintenanceNotifications,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(
        "notificationPreferences",
        JSON.stringify(notificationPreferences)
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSaveSuccess(true);
      toast.success("🔔 Notifications saved!", {
        description: "Your notification preferences have been updated",
      });
    } catch (error) {
      toast.error("Failed to save notification preferences");
    } finally {
      setNotificationSaving(false);
    }
  };

  const notificationSettings = [
    {
      title: "Low Stock Alerts",
      desc: "Get notified when inventory items are running low",
      state: lowStockAlerts,
      setState: setLowStockAlerts,
      icon: "📦",
    },
    {
      title: "Email Notifications",
      desc: "Receive important updates via email",
      state: emailNotifications,
      setState: setEmailNotifications,
      icon: "📧",
    },
    {
      title: "Security Alerts",
      desc: "Notifications about account security and login activity",
      state: securityAlerts,
      setState: setSecurityAlerts,
      icon: "🔒",
    },
    {
      title: "Product Updates",
      desc: "Alerts when new products are added or modified",
      state: productUpdates,
      setState: setProductUpdates,
      icon: "🔄",
    },
    {
      title: "Maintenance Notifications",
      desc: "System maintenance and downtime alerts",
      state: maintenanceNotifications,
      setState: setMaintenanceNotifications,
      icon: "⚙️",
    },
  ];

  return (
    <Card className="border-0 shadow-lg shadow-primary/5 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Notification Preferences</CardTitle>
            <CardDescription>
              Choose how you want to be notified
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Success Message */}
        {saveSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Notification preferences saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {notificationSettings.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-lg">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <Label className="text-base font-semibold block mb-1">
                  {item.title}
                </Label>
                <p className="text-sm text-muted-foreground truncate">
                  {item.desc}
                </p>
              </div>
            </div>
            <Switch
              checked={item.state}
              onCheckedChange={item.setState}
              className="ml-2"
              disabled={notificationSaving}
            />
          </div>
        ))}

        <Separator className="my-4" />

        {/* Save Notifications Button */}
        <Button
          onClick={handleSaveNotifications}
          disabled={notificationSaving}
          className="w-full gap-2"
          size="lg"
        >
          {notificationSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Preferences...
            </>
          ) : (
            <>
              <Bell className="h-4 w-4" />
              Save Notification Settings
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(userCache);
  const [loading, setLoading] = useState(!userCache);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data with caching
  const fetchUserData = useCallback(async () => {
    if (userCache) {
      setUser(userCache);
      return;
    }

    try {
      console.log("🔄 Settings: Fetching user data...");
      setLoading(true);
      setError(null);

      const response = await getCurrentUserService();
      console.log("✅ Settings: User data received:", response);

      if (response.success && response.user) {
        userCache = response.user;
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      } else {
        throw new Error(response.message || "Failed to fetch user data");
      }
    } catch (err: any) {
      console.error("❌ Settings: Error fetching user:", err);
      setError(err.message || "Failed to fetch user data");

      // Try localStorage as fallback
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          userCache = parsedUser;
          setUser(parsedUser);
          setError(null);
        } catch (parseError) {
          console.error("❌ Settings: Error parsing stored user:", parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    userCache = updatedUser;
    localStorage.setItem("user", JSON.stringify(updatedUser));

    const event = new CustomEvent("profileUpdated", {
      detail: { user: updatedUser },
    });
    window.dispatchEvent(event);
  };

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="space-y-2 mb-8">
          <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-6">
              <div className="h-64 bg-card/50 rounded-xl border border-border/50 animate-pulse" />
              <div className="h-80 bg-card/50 rounded-xl border border-border/50 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center space-y-6">
            <div className="bg-card/50 rounded-2xl border border-border/50 p-8">
              <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Unable to Load Settings
              </h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={fetchUserData} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Reload Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center space-y-6">
            <div className="bg-card/50 rounded-2xl border border-border/50 p-8">
              <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
              <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
              <p className="text-muted-foreground mb-6">
                Please log in to access your settings.
              </p>
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center lg:text-left mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Manage your profile, notifications, and security preferences
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Profile & Security */}
          <div className="space-y-8">
            {/* Profile Information */}
            <ProfileForm user={user} onProfileUpdate={handleProfileUpdate} />

            {/* Change Password */}
            <ChangePasswordSection />
          </div>

          {/* Right Column - Notifications */}
          <div className="space-y-8">
            {/* Notifications Settings */}
            <NotificationSettings />

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg shadow-primary/5 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start gap-2 h-12"
                  >
                    <UserIcon className="h-4 w-4" />
                    Account Privacy
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2 h-12"
                  >
                    <Smartphone className="h-4 w-4" />
                    Mobile Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2 h-12"
                  >
                    <Shield className="h-4 w-4" />
                    Security
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2 h-12"
                  >
                    <Bell className="h-4 w-4" />
                    Notification History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
