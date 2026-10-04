import React, { createContext, useContext, useEffect } from "react";

// Dark Electric Violet Design System Theme (matching reference image)
export const THEME = {
  id: "dark-violet",
  name: "Dark Electric Violet",
  colors: ["#7C3AED", "#8B5CF6", "#C084FC"],
  isDark: true,
  accent: "#8B5CF6", // Radiant Violet
  accentSecondary: "#7C3AED", // Electric Purple
  accentHover: "#A855F7",
  landmarkColor: "#8B5CF6",
  landmarkGlow: "#A855F7",
  avatarColor: "#8B5CF6",
  avatarArmColor: "#7C3AED",
  emerald: "#8B5CF6",
  amber: "#F59E0B",
  rose: "#A855F7",
  bgCanvas: "#0B0B0E", // Deep Obsidian Black
  bgCardDark: "#14141A", // Deep Charcoal Glass
  cardOffwhite: "#181822", // Elevated Card
  textMain: "#FFFFFF",
};

export const THEMES = [THEME];

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark-violet");
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme: THEME, currentThemeId: "dark-violet", themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
