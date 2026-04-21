"use client";
import React from "react";
import { CircleFlag } from "react-circle-flags";
import { Search, User, MapPin, ChevronDown } from "lucide-react";
import UserMenu from "@/components/Auth/UserMenu";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Link from "next/link";
// ─── Types ────────────────────────────────────────────────────────────────────

type Locale = "es" | "en";

interface NavIconsProps {
  isScrolled: boolean;
  locale: Locale;
  user: SupabaseUser | null;
  onSearchToggle: () => void;
  onLanguageToggle: () => void;
  onLoginRedirect: () => void;
  onDestinationsClick: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const NavIcons: React.FC<NavIconsProps> = ({
  isScrolled,
  locale,
  user,
  onSearchToggle,
  onLanguageToggle,
  onLoginRedirect,
  onDestinationsClick,
}) => {
  const dropShadow = !isScrolled
    ? "drop-shadow-[0_0_10px_rgba(1,1,1,0.9)]"
    : "";
  const basePath = locale === "es" ? "destinos" : "destinations";
  return (
    <div className="flex items-center gap-3 relative z-[10000]">
      {/* ── Destinations (desktop only) ── */}
      <Link href={`/${locale}/${basePath}`}>
        <div className="relative group hidden md:block">
          <div
            className="flex items-center gap-1 p-2 rounded-full transition-all duration-300
           hover:scale-110 pointer-events-auto z-[10001] cursor-pointer"
           
          >
            <MapPin className={`w-5 h-5 text-nav ${dropShadow}`} />
            <ChevronDown className={`w-3 h-3 text-nav ${dropShadow}`} />
          </div>

          {/* Tooltip */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1
           bg-black/80 text-white text-sm uppercase tracking-wider
           rounded whitespace-nowrap opacity-0 group-hover:opacity-100
           transition-opacity duration-200 pointer-events-none"
          >
            {locale === "es" ? "Ver destinos" : "See destinations"}
          </div>
        </div>
      </Link>
      {/* ── Search (desktop only) ── */}
      <button
        type="button"
        className="p-2 rounded-full transition-all duration-300 hover:scale-110 pointer-events-auto z-[10001] hidden md:block"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSearchToggle();
        }}
        aria-label="Buscar"
      >
        <Search className={`w-5 h-5 text-nav ${dropShadow}`} />
      </button>

      {/* ── Language (desktop only) ── */}
      <div
        onClick={onLanguageToggle}
        className="flex items-center justify-center p-2 rounded-full transition-all duration-300 hover:scale-110 pointer-events-auto z-[10001] hidden md:flex cursor-pointer"
        aria-label="Cambiar idioma"
      >
        <button
          className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center"
          type="button"
        >
          {locale === "es" ? (
            <CircleFlag countryCode="mx" />
          ) : (
            <CircleFlag countryCode="us" />
          )}
        </button>
      </div>

      {/* ── User ── */}
      <div className="relative pointer-events-auto z-[10001]">
        {user ? (
          <UserMenu isMobile={false} />
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLoginRedirect();
            }}
            className="p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/90 pointer-events-auto z-[10002]"
            aria-label="Iniciar sesión"
          >
            <User className={`w-5 h-5 text-nav ${dropShadow}`} />
          </button>
        )}
      </div>
    </div>
  );
};
