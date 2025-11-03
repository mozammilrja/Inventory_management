import api from "@/api/axios";
import { toast } from "sonner";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
  error?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Cache for user data only (no tokens)
let userCache: User | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Common error handler
const handleAuthError = (error: any, defaultMessage: string): never => {
  console.error(`Auth Service Error: ${defaultMessage}`, error);

  if (error.code === "ECONNABORTED") {
    throw new Error("Request timeout. Please check your connection.");
  }

  if (error.response?.status === 401) {
    // Clear cache on unauthorized
    clearUserCache();

    // Dispatch auth expired event for components to handle
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("auth-expired", {
          detail: { message: "Session expired. Please login again." },
        })
      );
    }

    throw new Error("Session expired. Please login again.");
  }

  if (error.response?.status >= 500) {
    throw new Error("Server error. Please try again later.");
  }

  throw new Error(
    error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      defaultMessage
  );
};

// Cache management
export const clearUserCache = (): void => {
  userCache = null;
  cacheTimestamp = 0;
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  }
};

const setUserCache = (user: User): void => {
  userCache = user;
  cacheTimestamp = Date.now();

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.warn("Could not store user in localStorage:", error);
    }
  }
};

const getUserFromCache = (): User | null => {
  // Check memory cache first
  if (userCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return userCache;
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        userCache = user;
        cacheTimestamp = Date.now();
        return user;
      }
    } catch (error) {
      console.warn("Could not parse user from localStorage:", error);
      clearUserCache();
    }
  }

  return null;
};

// Registration Service
export const registerService = async (
  data: RegisterData
): Promise<AuthResponse> => {
  try {
    console.log("🔄 [AUTH] Starting registration service...", {
      email: data.email,
      name: data.name,
    });

    // Clear any existing cache before registration
    clearUserCache();

    const res = await api.post("/auth/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
      withCredentials: true, // Important for cookies
    });

    console.log("✅ [AUTH] Registration API response:", {
      status: res.status,
      success: res.data.success,
      hasUser: !!res.data.user,
      message: res.data.message,
    });

    // ✅ Handle successful registration
    if (res.data.success && res.data.user) {
      console.log("🎉 [AUTH] Registration successful:", {
        user: res.data.user,
        // Tokens are in HTTP-only cookies, not in response body
      });

      // Cache user data
      setUserCache(res.data.user);

      return {
        success: true,
        user: res.data.user,
        // No accessToken in response - it's in cookies
        message: res.data.message,
      };
    } else {
      // Registration failed but API returned 200
      console.error(
        "❌ [AUTH] Registration failed with success:false",
        res.data
      );
      return {
        success: false,
        error: res.data.error || "Registration failed",
        message: res.data.message,
      };
    }
  } catch (error: any) {
    console.error("❌ [AUTH] Registration request failed:", error);

    // Enhanced error logging
    if (error.response) {
      console.error("📋 [AUTH] Error response details:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });

      // Handle specific HTTP status codes
      if (error.response.status === 400) {
        throw new Error(
          error.response.data?.error || "Invalid registration data"
        );
      } else if (error.response.status === 409) {
        throw new Error(error.response.data?.error || "User already exists");
      } else if (error.response.status === 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error(error.response.data?.error || "Registration failed");
      }
    } else if (error.request) {
      // Network errors
      console.error("🌐 [AUTH] Network error - no response received");
      throw new Error("Network error. Please check your connection.");
    } else {
      // Other errors
      console.error("⚡ [AUTH] Request setup error:", error.message);
      throw new Error("Registration request failed");
    }
  }
};

export const loginService = async (data: LoginData): Promise<AuthResponse> => {
  try {
    console.log("🔄 [AUTH] Starting login service...", {
      email: data.email,
    });

    // Clear any existing cache before login
    clearUserCache();

    console.log("📤 [AUTH] Making POST request to /auth/login");
    const res = await api.post("/auth/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    // ✅ CRITICAL: Log the raw response first
    console.log("📥 [AUTH] RAW API RESPONSE:", {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      data: res.data,
      dataType: typeof res.data,
      keys: Object.keys(res.data),
    });

    // ✅ Check the actual response structure
    const responseData = res.data;

    if (responseData.success === true && responseData.user) {
      console.log("🎉 [AUTH] Login successful with standard structure");

      // Cache user data
      setUserCache(responseData.user);

      return {
        success: true,
        user: responseData.user,
        accessToken: responseData.accessToken || responseData.token,
        refreshToken: responseData.refreshToken,
        message: responseData.message,
      };
    } else {
      console.error(
        "❌ [AUTH] Login failed - no success or user in response",
        responseData
      );

      return {
        success: false,
        error:
          responseData.error ||
          responseData.message ||
          "Invalid email or password",
        message: responseData.message,
      };
    }
  } catch (error: any) {
    console.error("❌ [AUTH] Login request failed:", error);

    // Enhanced error logging
    if (error.response) {
      console.error("📋 [AUTH] Error response details:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.response.config?.url,
        method: error.response.config?.method,
      });

      // Return the error from backend directly
      return {
        success: false,
        error:
          error.response.data?.error ||
          error.response.data?.message ||
          "Login failed",
        message: error.response.data?.message,
      };
    } else if (error.request) {
      // Network errors
      console.error("🌐 [AUTH] Network error - no response received");
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    } else {
      // Other errors
      console.error("⚡ [AUTH] Request setup error:", error.message);
      return {
        success: false,
        error: "Login request failed",
      };
    }
  }
};

// ✅ FIXED: Logout service
export const logoutService = async (): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    console.log("🔄 Logging out...");

    // Clear local storage first
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      clearUserCache();
    }

    // Call logout endpoint
    const response = await api.post("/auth/logout");

    console.log("✅ Logout API call successful");
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error: any) {
    console.error("❌ Logout API call failed:", error);

    // Even if API call fails, clear local data
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      clearUserCache();
    }

    return {
      success: false,
      message: error.response?.data?.message || "Logout completed locally",
    };
  }
};

// Get current user service
export const getCurrentUserService = async (
  forceRefresh: boolean = false
): Promise<AuthResponse> => {
  try {
    // Return cached user if available and not forcing refresh
    if (!forceRefresh) {
      const cachedUser = getUserFromCache();
      if (cachedUser) {
        console.log("✅ Returning cached user data");
        return {
          success: true,
          user: cachedUser,
        };
      }
    }

    console.log("🔄 Fetching current user from server...");

    const response = await api.get("/auth/profile");
    console.log("✅ Profile API response received");

    if (response.data.success && response.data.user) {
      setUserCache(response.data.user);
      console.log("✅ User data cached successfully");
      return response.data;
    } else {
      console.log("❌ No user data in response");
      clearUserCache();
      return {
        success: false,
        message: response.data.message || "Failed to fetch user profile",
      };
    }
  } catch (error: any) {
    console.error("❌ Profile fetch error:", error);

    if (error.response?.status === 401) {
      console.log("🔐 Unauthorized - clearing cache");
      clearUserCache();
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    // Don't throw for profile fetch errors, just return failure
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch user data",
    };
  }
};

// Update profile service
export const updateProfileService = async (
  data: UpdateProfileData
): Promise<AuthResponse> => {
  try {
    console.log("🔄 Updating user profile...", data);

    const response = await api.put("/auth/profile", data);

    if (response.data.success && response.data.user) {
      setUserCache(response.data.user);

      // Notify other components about the profile update
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("profileUpdated", {
            detail: { user: response.data.user },
          })
        );
      }
    }

    return response.data;
  } catch (error: any) {
    throw handleAuthError(error, "Failed to update profile");
  }
};

// Change password service
export const changePasswordService = async (
  data: ChangePasswordData
): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log("🔄 Changing password...");

    const response = await api.put("/auth/change-password", data);

    console.log("✅ Password changed successfully");
    return response.data;
  } catch (error: any) {
    throw handleAuthError(error, "Failed to change password");
  }
};

// Refresh token service
export const refreshTokenService = async (): Promise<AuthResponse> => {
  try {
    console.log("🔄 Refreshing token...");

    const response = await api.post("/auth/refresh");

    console.log("✅ Token refreshed successfully");
    return response.data;
  } catch (error: any) {
    clearUserCache();
    throw handleAuthError(error, "Token refresh failed");
  }
};

// Get current user from cache
export const getCurrentUserSync = (): User | null => {
  return getUserFromCache();
};

// ✅ Force clear authentication
export const forceLogout = (message: string = "Session expired"): void => {
  if (typeof window !== "undefined") {
    clearUserCache();
    toast.error(message);

    // Only redirect if we're on a protected page
    const protectedRoutes = ["/dashboard", "/profile", "/settings"];
    const currentPath = window.location.pathname;
    const isProtectedRoute = protectedRoutes.some((route) =>
      currentPath.startsWith(route)
    );

    if (isProtectedRoute) {
      setTimeout(() => {
        window.location.href = `/?redirect=${encodeURIComponent(currentPath)}`;
      }, 1000);
    }
  }
};
