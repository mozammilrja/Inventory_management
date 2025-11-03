import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  isRegistering: boolean;
  error: string | null;
  registerSuccess: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: false,
  isRegistering: false,
  error: null,
  registerSuccess: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerStart: (state) => {
      state.isRegistering = true;
      state.error = null;
      state.registerSuccess = false;
    },
    registerSuccess: (
      state,
      action: PayloadAction<{ user: User; token?: string }>
    ) => {
      state.isRegistering = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token || null;
      state.registerSuccess = true;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isRegistering = false;
      state.error = action.payload;
      state.registerSuccess = false;
    },
    clearRegisterStatus: (state) => {
      state.registerSuccess = false;
      state.error = null;
    },

    // Login actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string | null }>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },

    // Logout action
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      state.registerSuccess = false;
    },

    // Set user - NEW ACTION ADDED
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    // Update profile
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Clear errors
    clearError: (state) => {
      state.error = null;
    },

    // Set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

// Export actions
export const {
  registerStart,
  registerSuccess,
  registerFailure,
  clearRegisterStatus,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  updateProfile,
  clearError,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;
