"use client";
import { useTheme } from "@/lib/context/ThemeContext";
import { TbBulbOff, TbBulbFilled } from "react-icons/tb";
import { RiLightbulbFlashFill } from "react-icons/ri";
import { useState } from "react";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const themes = [
    { value: "dark" as const, label: "Dark", icon: <TbBulbOff size={20} /> },
    {
      value: "light" as const,
      label: "Light",
      icon: <TbBulbFilled size={20} />,
    },
    {
      value: "vibrant" as const,
      label: "Vibrant",
      icon: <RiLightbulbFlashFill size={20} />,
    },
  ];

  return (
    <div className="relative nav">
      <button
        onClick={() => setOpen(!open)}
        className={`p-2 text-theme rounded-lg transition-colors  hover:bg-[var(--bg-secondary)]`}
      >
        {themes.find((t) => t.value === theme)?.icon}
      </button>

      {open && (
        <div
          className={`absolute left-0 right-0 top-full mt-2 flex flex-col shadow-lg z-10 rounded bg-theme-secondary`}
        >
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setTheme(t.value);
                setOpen(false);
              }}
              className={`relative group w-auto h-10  flex items-center justify-center rounded transition-colors text-theme hover:bg-[var(--bg-tertiary)] `}
            >
              {t.icon}
              {/* Tooltip */}
              <span
                className={`absolute left-full ml-2 px-2 py-1 text-xs rounded  opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none bg-[var(--bg-tertiary)] `}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
