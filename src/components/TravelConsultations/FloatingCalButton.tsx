"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Locale } from "@/types/locale";
import { FaCalendarAlt, FaTimes, FaCheckCircle } from "react-icons/fa";
import { MdFlightTakeoff } from "react-icons/md";
import { Compass } from "lucide-react";

interface Props {
  locale: Locale;
}

const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

export default function FloatingCalButton({ locale }: Props) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const href =
    locale === "es"
      ? `/${locale}/asesoria-de-viaje`
      : `/${locale}/travel-consultation`;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* ── Floating Button ── */}
      <div
        className={`fixed bottom-20 left-6 z-50 transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <span className="absolute inset-0 rounded-sm animate-ping bg-[var(--accent)]/25 pointer-events-none" />
        <Link href={href}>
          <button
            aria-label={t(locale, "Reservar asesoría", "Book consultation")}
            className="group relative flex items-center gap-0 hover:gap-3 overflow-hidden max-w-[46px] hover:max-w-xs transition-all duration-500 ease-in-out bg-theme-accent text-theme-btn rounded-sm px-3 py-3 shadow-lg shadow-black/40"
          >
            <FaCalendarAlt className="text-lg flex-shrink-0" />
            <span className="whitespace-nowrap text-xs font-bold tracking-[0.15em] uppercase overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-500 ease-in-out">
              {t(locale, "Reservar asesoría", "Book consultation")}
            </span>
          </button>
        </Link>
      </div>

   
    </>
  );
}
