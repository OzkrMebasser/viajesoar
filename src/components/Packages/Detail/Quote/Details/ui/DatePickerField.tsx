"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { es, enUS } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { type Locale, t } from "@/types/quote";
import { FaCalendarAlt } from "react-icons/fa";
import { LuCalendarSearch } from "react-icons/lu";

interface DatePickerFieldProps {
  locale: Locale;
  value: string;
  onChange: (val: string) => void;
}

export function DatePickerField({ locale, value, onChange }: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);

  const selected = value ? new Date(value + "T00:00:00") : undefined;

  const formatted = selected
    ? selected.toLocaleDateString(locale === "es" ? "es-MX" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="relative">
      {/* Input trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="input-base w-full text-left flex items-center justify-between"
      >
        <span className={formatted ? "text-[var(--text)]" : "text-[var(--text)]/25"}>
          {formatted ?? t(locale, "Selecciona tu salida", "Select your departure")}
        </span>
        <LuCalendarSearch className="text-[var(--text)]/80 flex-shrink-0 text-[16px]" />
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-md shadow-lg p-2">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                const iso = date.toISOString().split("T")[0];
                onChange(iso);
                setOpen(false);
              }
            }}
            locale={locale === "es" ? es : enUS}
            disabled={{ before: new Date() }}
            style={{
              "--rdp-accent-color": "var(--accent)",
              "--rdp-accent-background-color": "color-mix(in srgb, var(--accent) 15%, transparent)",
              "--rdp-background-color": "var(--bg)",
              "--rdp-day-button-border-radius": "4px",
            } as React.CSSProperties}
          />
        </div>
      )}
    </div>
  );
}