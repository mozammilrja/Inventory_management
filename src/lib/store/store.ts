// lib/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/es/storage";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import uiReducer from "./slices/uiSlice";

// Persist configuration for Auth state
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated", "token"],
};

// Persist configuration for UI state
const uiPersistConfig = {
  key: "ui",
  storage,
  whitelist: ["sidebarOpen"],
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUiReducer = persistReducer(uiPersistConfig, uiReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    product: productReducer,
    ui: persistedUiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
