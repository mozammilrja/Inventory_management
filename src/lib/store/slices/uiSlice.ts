// lib/store/slices/uiSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  sidebarOpen: boolean;
}

const initialState: UIState = {
  sidebarOpen: true, // Default to open
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebar: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
  },
});

export const { toggleSidebar, setSidebar, openSidebar, closeSidebar } =
  uiSlice.actions;
export default uiSlice.reducer;
