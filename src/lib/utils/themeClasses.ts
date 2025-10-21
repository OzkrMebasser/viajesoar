// lib/utils/themeClasses.ts
import type { ThemeName, ThemeClasses } from '@/types/tailwind';

export const themeClasses: Record<ThemeName, ThemeClasses> = {
  dark: {
    text: "text-dark-text",
    bg: "bg-dark-bg",
    bgSecondary: "bg-dark-bg-secondary",
    textSecondary: "text-dark-text-secondary",
    accent: "text-dark-accent",
    accentHover: "hover:text-dark-accent-hover",
    border: "border-dark-border",
    gradient: "bg-gradient-dark",
  },
  light: {
    text: "text-light-text",
    bg: "bg-light-bg",
    bgSecondary: "bg-light-bg-secondary",
    textSecondary: "text-light-text-secondary",
    accent: "text-light-accent",
    accentHover: "hover:text-light-accent-hover",
    border: "border-light-border",
    gradient: "bg-gradient-light",
  },
  vibrant: {
    text: "text-vibrant-text",
    bg: "bg-vibrant-bg",
    bgSecondary: "bg-vibrant-bg-secondary",
    textSecondary: "text-vibrant-text-secondary",
    accent: "text-vibrant-accent",
    accentHover: "hover:text-vibrant-accent-hover",
    border: "border-vibrant-border",
    gradient: "bg-gradient-vibrant",
  },
};

export const getThemeClasses = (theme: ThemeName): ThemeClasses => 
  themeClasses[theme];