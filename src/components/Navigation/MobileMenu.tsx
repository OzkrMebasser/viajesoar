"use client";
import React from "react";
import { CircleFlag } from "react-circle-flags";
import { Search, IndentDecrease } from "lucide-react";
import { Link } from "@/app/i18n/navigation";
import ThemeSelector from "@/components/ThemeSelector";
import { MegaMenuDestinations } from "@/components/Navigation/MegaMenuDestinations";
import type { NavRegion } from "@/lib/data/destinations";

// ─── Types ────────────────────────────────────────────────────────────────────

type Locale = "es" | "en";

interface NavItem {
  label: string;
  href: string;
  isDestinations?: boolean;
}

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  locale: Locale;
  activeItem: string;
  navRegions: NavRegion[];
  onClose: () => void;
  onSearchToggle: () => void;
  onLanguageToggle: () => void;
  onNavItemClick: (label: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navItems,
  locale,
  activeItem,
  navRegions,
  onClose,
  onSearchToggle,
  onLanguageToggle,
  onNavItemClick,
}) => {
  return (
    <div
      className={`nav fixed inset-0 z-40 transition-all duration-500 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      id="mobile-menu"
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--accent)]/20 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
        aria-label="Cerrar menú"
      />

      {/* Drawer */}
      <div
        className={`absolute top-0 left-0 h-full w-80 bg-gradient-theme transform transition-transform duration-500 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-(--text)">
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-theme rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
            aria-label="Cerrar menú"
          >
            <IndentDecrease className="w-6 h-6" />
          </button>

          <button
            type="button"
            className="p-2 text-theme rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSearchToggle();
              onClose();
            }}
            aria-label="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onLanguageToggle}
            className="p-2 text-theme rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
            aria-label="Cambiar idioma"
          >
            {locale === "es" ? (
              <CircleFlag className="w-5 h-5" countryCode="mx" />
            ) : (
              <CircleFlag className="w-5 h-5" countryCode="us" />
            )}
          </button>

          <ThemeSelector />
        </div>

        {/* Nav items */}
        <div className="px-5 flex flex-col justify-evenly h-full relative z-50">
          <div className="space-y-12 lg:space-y-10 bottom-20 lg:bottom-14 relative z-50">
            {navItems.map((item, index) => {
              // ── Destinations: MegaMenuDestinations en modo mobile ──
              if (item.isDestinations) {
                return (
                  <div
                    key={index}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: isOpen
                        ? "slideInLeft 0.6s ease-out forwards"
                        : "none",
                    }}
                  >
                    <MegaMenuDestinations
                      locale={locale}
                      regions={navRegions}
                      isMobile
                      mobileLabel={item.label}
                      onNavigate={onClose}
                      trigger={null}
                    />
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  href={item.href as any}
                  onClick={() => {
                    onNavItemClick(item.label);
                    onClose();
                  }}
                  className={`block w-full text-left font-medium transition-all duration-300 transform hover:translate-x-2 tracking-wider uppercase text-sm ${
                    activeItem === item.label
                      ? "text-theme accent"
                      : "text-theme hover:accent-hover"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isOpen
                      ? "slideInLeft 0.6s ease-out forwards"
                      : "none",
                  }}
                  aria-current={activeItem === item.label ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};