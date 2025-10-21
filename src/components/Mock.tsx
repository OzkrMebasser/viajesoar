"use client";
import { useTheme } from "@/lib/context/ThemeContext";

const Mock = () => {
  const { theme } = useTheme();

  return (
    <div>
      <h2>Hola desde {theme} theme!</h2>
    </div>
  );
};

export default Mock;
