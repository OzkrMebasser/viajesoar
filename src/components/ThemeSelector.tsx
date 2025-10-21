"use client";
import { useTheme } from "@/lib/context/ThemeContext";
import { TbBulbOff, TbBulbFilled } from "react-icons/tb";
import { RiLightbulbFlashFill } from "react-icons/ri";
import { useState } from "react";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const themes = [
    { value: "dark", icon: <TbBulbOff size={15} /> },
    { value: "light", icon: <TbBulbFilled size={15} /> },
    { value: "vibrant", icon: <RiLightbulbFlashFill size={15} /> },
  ];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full bg-theme-secondary text-theme-secondary  transition-colors"
      >
        {themes.find((t) => t.value === theme)?.icon}
      </button>

      {open && (
        <div className="absolute -right-[1px] mt-2 flex flex-col bg-theme text-theme-secondary border border-theme-secondary shadow-lg z-10 rounded">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setTheme(t.value as any);
                setOpen(false);
              }}
              className={` w-8 h-8 flex items-center justify-center rounded transition-colors ${
                theme === t.value
                  ? "bg-theme-secondary text-theme-secondary  "
                  : "hover:bg-theme-secondary hover:text-theme-secondary"
              }`}
            >
              {t.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
