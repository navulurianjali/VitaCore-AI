"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
export type ActiveMode = "wellness" | "performance" | "elderly";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  activeMode: ActiveMode;
  setActiveMode: (mode: ActiveMode) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [activeMode, setActiveModeState] = useState<ActiveMode>("wellness");

  useEffect(() => {
    // Load from local storage
    const storedTheme = localStorage.getItem("vitalcore-theme") as Theme;
    const storedMode = localStorage.getItem("vitalcore-mode") as ActiveMode;

    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }

    // Safeguard to clean up older extraneous modes
    if (storedMode && (storedMode === "wellness" || storedMode === "performance" || storedMode === "elderly")) {
      setActiveModeState(storedMode);
    } else {
      setActiveModeState("wellness");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply dark/light theme classes
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("vitalcore-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;

    // Apply active mode classes strictly matching the 3 modes
    root.classList.remove("wellness-mode", "performance-mode", "elderly-mode");
    root.classList.add(`${activeMode}-mode`);
    
    localStorage.setItem("vitalcore-mode", activeMode);
  }, [activeMode]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setActiveMode = (mode: ActiveMode) => {
    setActiveModeState(mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, activeMode, setActiveMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
