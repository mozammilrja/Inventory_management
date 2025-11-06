// api/axios.ts - UPDATED VERSION
import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // This ensures cookies are sent automatically
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ✅ REMOVED: No more manual token handling in request interceptor
api.interceptors.request.use(
  (config) => {
    // Cookies are sent automatically with withCredentials: true
    // No need to manually add tokens to headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh automatically
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401 errors)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Attempting to refresh token...");

        // Call refresh token endpoint
        await api.post("/auth/refresh");

        // Process queued requests
        processQueue(null);

        console.log("✅ Token refreshed successfully");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);

        // Clear user cache
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
        }

        // Process queue with error
        processQueue(refreshError, null);

        // Show user-friendly notification
        // toast.error("Your session has expired. Please login again.");

        // Dispatch event for components to handle automatic logout
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth-expired"));
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors with user-friendly messages
    if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (error.response?.status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else if (error.code === "ECONNABORTED") {
      toast.error("Request timeout. Please check your connection.");
    } else if (error.response?.status === 400) {
      console.log("Validation error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
