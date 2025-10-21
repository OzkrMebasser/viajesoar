/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🌙 Dark Theme
        dark: {
          bg: "#0f172a",
          "bg-secondary": "#1e293b",
          text: "#f8fafc",
          "text-secondary": "#cbd5e1",
          accent: "#14b8a6",
          "accent-hover": "#0d9488",
          border: "#334155",
        },
        // ☀️ Light Theme
        light: {
          bg: "#ffffff",
          "bg-secondary": "#f1f5f9",
          text: "#1e293b",
          "text-secondary": "#475569",
          accent: "#0891b2",
          "accent-hover": "#0e7490",
          border: "#e2e8f0",
        },
        // 🌴 Vibrant Theme
        vibrant: {
          bg: "#fff7ed",
          "bg-secondary": "#fed7aa",
          text: "#7c2d12",
          "text-secondary": "#92400e",
          primary: "#ea580c",
          secondary: "#f59e0b",
          accent: "#06b6d4",
          "accent-hover": "#0891b2",
          border: "#fed7aa",
        },
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(to bottom, #0f172a, #1e293b, #0f172a)",
        "gradient-light": "linear-gradient(to bottom, #ffffff, #f1f5f9, #ffffff)",
        "gradient-vibrant": "linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #ffedd5 100%)",
      },
    },
  },
plugins: [
  // Plugin para aplicar temas dinámicamente
  ({ addBase, matchUtilities, theme }) => {
    addBase({
      "html[data-theme='dark']": {
        "color-scheme": "dark",
      },
      "html[data-theme='light']": {
        "color-scheme": "light",
      },
      "html[data-theme='vibrant']": {
        "color-scheme": "light",
      },
    });

    // Esto permite usar clases como "text-dark-text", "bg-light-bg", etc
    matchUtilities(
      {
        // bg-dark-bg, bg-light-bg, bg-vibrant-bg
        "bg": (value) => ({ "background-color": value }),
        "text": (value) => ({ color: value }),
        "border": (value) => ({ "border-color": value }),
      },
      { values: theme("colors") }
    );
  },
],
};