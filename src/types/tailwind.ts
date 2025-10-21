// src/types/tailwind.ts

// Colors
export interface ThemeColors {
  bg: string;
  "bg-secondary": string;
  text: string;
  "text-secondary": string;
  accent: string;
  "accent-hover": string;
  border: string;
}

// Theme
export type ThemeName = "light" | "dark" | "vibrant";

export interface ThemeConfig {
  name: ThemeName;
  colors: ThemeColors;
  gradient: string;
}

// Classes
export interface ThemeClasses {
  text: string;
  bg: string;
  bgSecondary: string;
  textSecondary: string;
  accent: string;
  accentHover: string;
  border: string;
  gradient: string;
}