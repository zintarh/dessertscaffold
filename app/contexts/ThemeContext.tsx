'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  setIsDarkMode: () => {},
  toggleTheme: () => {}
});

function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return true; // SSR default
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme === 'dark';
  }
  
  // Default to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => getInitialTheme());
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
    setIsHydrated(true);
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      // Update document class for global styling
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
  }, [isDarkMode, isHydrated]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
