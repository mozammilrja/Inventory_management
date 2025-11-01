"use client";

import { useEffect } from "react";

export function ThemeScript() {
  useEffect(() => {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem("theme");
    const theme = storedTheme === "system" || !storedTheme
      ? (systemPrefersDark ? "dark" : "light")
      : storedTheme;

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, []);

  return null;
}
