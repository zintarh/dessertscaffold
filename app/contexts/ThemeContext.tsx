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
  isDarkMode: true,
  setIsDarkMode: () => {},
  toggleTheme: () => {},
  isHydrated: false,
});

function getInitialTheme(): boolean {
  // Always return false for SSR to prevent hydration mismatch
  // We'll set the actual theme after hydration
  return false;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false); // Start with light mode for SSR
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      // if (savedTheme) {
      //   setIsDarkMode(savedTheme === 'light');
      // } else {
      //   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      //   setIsDarkMode(prefersDark);
      // }

      setIsDarkMode(false);

      setIsHydrated(true);
    }
  }, []);

  // // Save theme to localStorage whenever it changes
  // useEffect(() => {
  //   if (isHydrated) {
  //     localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  //     // Update document class for global styling
  //     document.documentElement.classList.toggle('dark', isDarkMode);
  //   }
  // }, [isDarkMode, isHydrated]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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
