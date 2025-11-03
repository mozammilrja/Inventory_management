"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function SyncSystemTheme() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applySystemTheme = () => {
      const pref = localStorage.getItem("theme");
      // Only apply if "system" is selected
      if (pref === "system" || !pref) {
        setTheme("system");
      }
    };

    // Initial check when mounted
    applySystemTheme();

    // Listen for OS theme changes
    media.addEventListener("change", applySystemTheme);
    return () => media.removeEventListener("change", applySystemTheme);
  }, [theme, setTheme]);

  return null;
}
