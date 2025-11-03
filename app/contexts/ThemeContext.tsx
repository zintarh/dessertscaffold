"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  toggleTheme: () => void;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  setIsDarkMode: () => {},
  toggleTheme: () => {},
  isHydrated: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Initialize theme from storage or system preference
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = saved ? saved === "dark" : prefersDark;
    setIsDarkMode(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);
    setIsHydrated(true);
  }, []);

  // Persist and reflect on document class
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode, isHydrated]);

  const toggleTheme = () => setIsDarkMode((v) => !v);

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, setIsDarkMode, toggleTheme, isHydrated }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
