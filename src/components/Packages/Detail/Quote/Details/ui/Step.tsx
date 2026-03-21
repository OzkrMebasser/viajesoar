"use client";

import { type Locale } from "@/types/quote";
import { GiCheckMark } from "react-icons/gi";
import { useEffect, useState } from "react";

export function Step({
  number,
  label,
  children,
  completed = false,
  showStatus = true,
  locale = "es",
}: {
  number: number;
  label: string;
  children: React.ReactNode;
  completed?: boolean;
  showStatus?: boolean;
  locale?: Locale;
}) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (completed) {
      setAnimate(false);
      const t = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(t);
    }
  }, [completed]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className={`
          w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
          border font-bold transition-colors duration-300
          ${completed
            ? `bg-[var(--accent)] text-theme-btn border-[var(--accent)] ${animate ? "checkmark-pop" : ""}`
            : "bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30 text-[10px]"}
        `}>
          {completed
            ? <GiCheckMark  />
            : number}
        </span>
        <span className="text-[var(--text)]/80 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="space-y-3 p-2 lg:p-4">{children}</div>
    </div>
  );
}