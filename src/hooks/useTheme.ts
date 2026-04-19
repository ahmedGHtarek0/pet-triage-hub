import { useEffect, useState, useCallback } from "react";

export type ThemeMode = "light" | "dark" | "ocean" | "sunset" | "forest";

const STORAGE_KEY = "pet-planet-theme";
const ALL_THEMES: ThemeMode[] = ["light", "dark", "ocean", "sunset", "forest"];

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  // Remove all theme classes
  ALL_THEMES.forEach((t) => root.classList.remove(t));
  // dark base for non-light themes that need dark surface
  if (theme === "light") {
    // default
  } else {
    root.classList.add(theme);
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem(STORAGE_KEY) as ThemeMode) || "light";
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((t: ThemeMode) => setThemeState(t), []);

  const cycleTheme = useCallback(() => {
    setThemeState((t) => {
      const idx = ALL_THEMES.indexOf(t);
      return ALL_THEMES[(idx + 1) % ALL_THEMES.length];
    });
  }, []);

  return { theme, setTheme, cycleTheme, themes: ALL_THEMES };
}
