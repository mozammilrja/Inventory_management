import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  user: { name: string; email: string } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
  user: null,
};

// ✅ Fetch user profile (decode + verify)
export const fetchProfile = createAsyncThunk("auth/fetchProfile", async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  // Decode JWT payload safely
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decodedPayload = JSON.parse(atob(base64));

  // Verify via backend
  const res = await fetch("/api/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  const userData = await res.json();

  return {
    token,
    user: {
      id: userData.id,
      name: userData.name || "User",
      email: userData.email || decodedPayload.email,
      phone: userData.phone || "",
      role: userData.role || "User",
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    },
  };
});

// ✅ Login thunk
export const loginAsync = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    localStorage.setItem("token", data.token);
    return { token: data.token };
  }
);

// ✅ Register thunk
export const registerAsync = createAsyncThunk(
  "auth/register",
  async ({
    name,
    email,
    password,
    phone,
  }: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");

    localStorage.setItem("token", data.token);
    return { token: data.token };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })

      // 🔹 Login
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // ✅ Do not mark authenticated yet — wait for fetchProfile()
        state.token = action.payload.token;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
      })

      // 🔹 Register
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Registration failed";
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
