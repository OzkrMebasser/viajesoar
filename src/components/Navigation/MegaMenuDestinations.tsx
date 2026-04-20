"use client";

import { useState, useEffect } from "react";
import { Link } from "@/app/i18n/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import type { NavRegion } from "@/lib/data/destinations";

type Locale = "es" | "en";

// ── Desktop Slide Panel ───────────────────────────────────────────────────────

function DesktopSlidePanel({
  locale,
  regions,
  onClose,
}: {
  locale: Locale;
  regions: NavRegion[];
  onClose: () => void;
}) {
  const [activeRegionId, setActiveRegionId] = useState<string | null>(null);
  const [activeCountryId, setActiveCountryId] = useState<string | null>(null);
  const basePath = locale === "es" ? "destinos" : "destinations";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[10004]" onClick={onClose} />

      {/* Panel */}
      <div
        className="fixed top-0 left-0 h-full w-80 z-[10005]
                   bg-gradient-theme border-r border-[var(--accent)]/15
                   flex flex-col overflow-hidden
                   animate-in slide-in-from-left-2 duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--text)]/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-3 bg-[var(--accent)] rounded-full" />
            <span className="text-[var(--accent)] text-sm tracking-wider uppercase">
              {locale === "es" ? "Destinos" : "Destinations"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-theme opacity-40 hover:opacity-100 transition-opacity text-xs"
          >
            ✕
          </button>
        </div>

        {/* Ver todos */}
        <Link
          href={`/${basePath}` as any}
          onClick={onClose}
          className="flex items-center justify-between px-4 py-3 text-sm uppercase
                     tracking-wider text-[var(--accent)] border-b border-[var(--text)]/10
                     hover:bg-[var(--accent)]/5 transition-colors flex-shrink-0"
        >
          {locale === "es" ? "Ver todos los destinos" : "See all destinations"}
          <FaArrowRight className="w-2 h-2" />
        </Link>

        {/* Lista scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--accent)]/20 scrollbar-track-transparent">
          {regions.map((region) => (
            <div
              key={region.id}
              className="border-b border-[var(--text)]/10 last:border-0"
            >
              {/* Región */}
              <button
                type="button"
                onClick={() => {
                  setActiveRegionId(
                    activeRegionId === region.id ? null : region.id,
                  );
                  setActiveCountryId(null);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-left
                            text-sm uppercase tracking-wider transition-all duration-150
                            ${
                              activeRegionId === region.id
                                ? "text-[var(--accent)] bg-[var(--accent)]/5 border-l-2 border-[var(--accent)]"
                                : "text-theme opacity-60 hover:opacity-100 hover:bg-[var(--accent)]/5 border-l-2 border-transparent"
                            }`}
              >
                <span>{region.name}</span>
                <ChevronDown
                  className={`w-3 h-3 opacity-40 transition-transform duration-200
                              ${activeRegionId === region.id ? "rotate-180" : ""}`}
                />
              </button>

              {/* Países */}
              {activeRegionId === region.id && (
                <div className="bg-[var(--accent)]/5">
                  <div className="px-4 py-1.5">
                    <span className="text-[var(--accent)] text-sm tracking-wider uppercase">
                      {locale === "es" ? "Países" : "Countries"}
                    </span>
                  </div>

                  {region.countries.length === 0 ? (
                    <p className="px-4 pb-3 text-theme opacity-20 text-sm italic">
                      {locale === "es" ? "Próximamente" : "Coming soon"}
                    </p>
                  ) : (
                    region.countries.map((country) => (
                      <div key={country.id}>
                        <div
                          className={`flex items-center justify-between border-l-2 transition-all
                                      ${
                                        activeCountryId === country.id
                                          ? "border-[var(--accent)] bg-[var(--accent)]/10"
                                          : "border-transparent"
                                      }`}
                        >
                          <Link
                            href={
                              `/${basePath}/${region.slug}/${country.slug}` as any
                            }
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm uppercase tracking-wider
                                       text-theme opacity-60 hover:opacity-100 hover:text-[var(--accent)] transition-all"
                          >
                            {country.name}
                          </Link>
                          {country.cities.length > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                setActiveCountryId(
                                  activeCountryId === country.id
                                    ? null
                                    : country.id,
                                )
                              }
                              className="px-3 py-2.5"
                            >
                              <ChevronRight
                                className={`w-3 h-3 text-theme opacity-30 transition-transform duration-200
                                            ${activeCountryId === country.id ? "rotate-90" : ""}`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Ciudades */}
                        {activeCountryId === country.id &&
                          country.cities.length > 0 && (
                            <div className="bg-[var(--accent)]/5 pb-1">
                              <div className="px-6 py-1">
                                <span className="text-[var(--accent)] text-sm tracking-wider uppercase">
                                  {locale === "es" ? "Ciudades" : "Cities"}
                                </span>
                              </div>
                              {country.cities.map((city) => (
                                <Link
                                  key={city.id}
                                  href={
                                    `/${basePath}/${region.slug}/${country.slug}/${city.slug}` as any
                                  }
                                  onClick={onClose}
                                  className="flex items-center gap-2 px-6 py-2 text-sm uppercase
                                           tracking-wider text-theme opacity-50 hover:opacity-100
                                           hover:text-[var(--accent)] hover:bg-[var(--accent)]/5
                                           transition-all group"
                                >
                                  <span
                                    className="w-1 h-1 rounded-full bg-[var(--accent)]/35
                                                 group-hover:bg-[var(--accent)] transition-colors flex-shrink-0"
                                  />
                                  {city.name}
                                </Link>
                              ))}
                              <div className="mx-4 mt-1 pt-2 border-t border-[var(--text)]/10">
                                <Link
                                  href={
                                    `/${basePath}/${region.slug}/${country.slug}` as any
                                  }
                                  onClick={onClose}
                                  className="flex items-center gap-1.5 text-sm text-[var(--accent)]
                                           uppercase tracking-wider hover:opacity-70 transition-opacity"
                                >
                                  {locale === "es" ? "Ver todo" : "See all"}
                                  <FaArrowRight className="w-2 h-2" />
                                </Link>
                              </div>
                            </div>
                          )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Mobile Accordion ──────────────────────────────────────────────────────────

function MobileAccordion({
  locale,
  regions,
  label,
  onNavigate,
  defaultOpen = false,
}: {
  locale: Locale;
  regions: NavRegion[];
  label: string;
  onNavigate: () => void;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeRegionId, setActiveRegionId] = useState<string | null>(null);
  const [activeCountryId, setActiveCountryId] = useState<string | null>(null);
  const basePath = locale === "es" ? "destinos" : "destinations";

  const activeRegion = regions.find((r) => r.id === activeRegionId) ?? null;
  const activeCountry =
    activeRegion?.countries.find((c) => c.id === activeCountryId) ?? null;

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className={`flex items-center justify-between w-full text-left font-medium
                    tracking-wider uppercase text-sm transition-all duration-300
                    transform hover:translate-x-2
                    ${isOpen ? "text-[var(--accent)]" : "text-theme hover:accent-hover"}`}
      >
        <span>{label}</span>
        <ChevronRight
          className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
        />
      </button>

      {/* Panel lateral — oculta el menú principal con translate */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0  "
            onClick={() => setIsOpen(false)}
          />

          {/* Panel nivel 1: regiones */}
          <div
            className="fixed top-20 left-0 h-full w-80 z-[10005]
                       bg-gradient-theme border-r border-[var(--text)]/10
                       flex flex-col overflow-hidden
                       animate-in slide-in-from-left-2 duration-300"
          >
            {/* Header con back */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--text)]/10 flex-shrink-0 ">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-theme opacity-60 hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span className="text-sm uppercase tracking-wider">
                  {locale === "es" ? "Menú" : "Menu"}
                </span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-3 bg-[var(--accent)] rounded-full" />
                <span className="text-[var(--accent)] text-sm tracking-wider uppercase">
                  {locale === "es" ? "Destinos" : "Destinations"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-theme opacity-40 hover:opacity-100 transition-opacity text-xs"
              >
                ✕
              </button>
            </div>

            {/* Ver todos */}
            <Link
              href={`/${basePath}` as any}
              onClick={() => {
                onNavigate();
                setIsOpen(false);
              }}
              className="flex items-center justify-between px-4 py-3 text-sm uppercase
                         tracking-wider text-[var(--accent)] border-b border-[var(--text)]/10
                         hover:bg-[var(--accent)]/5 transition-colors flex-shrink-0"
            >
              {locale === "es"
                ? "Ver todos los destinos"
                : "See all destinations"}
              <FaArrowRight className="w-2 h-2" />
            </Link>

            {/* Lista de regiones */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--accent)]/20 scrollbar-track-transparent">
              {regions.map((region) => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => setActiveRegionId(region.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left
                              text-sm uppercase tracking-wider transition-all duration-150
                              border-b border-[var(--text)]/10 last:border-0
                              ${
                                activeRegionId === region.id
                                  ? "text-[var(--accent)] bg-[var(--accent)]/5 border-l-2 border-[var(--accent)]"
                                  : "text-theme opacity-60 hover:opacity-100 hover:bg-[var(--accent)]/5 border-l-2 border-transparent"
                              }`}
                >
                  <span>{region.name}</span>
                  <ChevronRight className="w-3 h-3 opacity-40" />
                </button>
              ))}
            </div>
          </div>

          {/* Panel nivel 2: países */}
          {activeRegion && (
            <div
              className="fixed top-20 left-0 h-full w-80 z-[10006]
                         bg-gradient-theme border-r border-[var(--text)]/10
                         flex flex-col overflow-hidden
                         animate-in slide-in-from-right-2 duration-250"
            >
              {/* Header con back */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--text)]/10 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRegionId(null);
                    setActiveCountryId(null);
                  }}
                  className="flex items-center gap-2 text-theme opacity-60 hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span className="text-sm uppercase tracking-wider">
                    {locale === "es" ? "Regiones" : "Regions"}
                  </span>
                </button>
                <span className="text-[var(--accent)] text-sm tracking-wider uppercase truncate max-w-[120px]">
                  {activeRegion.name}
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-theme opacity-40 hover:opacity-100 transition-opacity text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Ver región */}
              <Link
                href={`/${basePath}/${activeRegion.slug}` as any}
                onClick={() => {
                  onNavigate();
                  setIsOpen(false);
                }}
                className="flex items-center justify-between px-4 py-3 text-sm uppercase
                           tracking-wider text-[var(--accent)] border-b border-[var(--text)]/10
                           hover:bg-[var(--accent)]/5 transition-colors flex-shrink-0"
              >
                {locale === "es"
                  ? `Ver todo ${activeRegion.name}`
                  : `See all ${activeRegion.name}`}
                <FaArrowRight className="w-2 h-2" />
              </Link>

              {/* Países label */}
              <div className="px-4 py-2 flex-shrink-0">
                <span className="text-[var(--accent)] text-sm tracking-wider uppercase">
                  {locale === "es" ? "Países" : "Countries"}
                </span>
              </div>

              {/* Lista de países */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--accent)]/20 scrollbar-track-transparent">
                {activeRegion.countries.length === 0 ? (
                  <p className="px-4 py-3 text-theme opacity-20 text-sm italic">
                    {locale === "es" ? "Próximamente" : "Coming soon"}
                  </p>
                ) : (
                  activeRegion.countries.map((country) => (
                    <button
                      key={country.id}
                      type="button"
                      onClick={() =>
                        country.cities.length > 0
                          ? setActiveCountryId(country.id)
                          : null
                      }
                      className={`w-full flex items-center justify-between px-4 py-3 text-left
                                  text-sm uppercase tracking-wider transition-all duration-150
                                  border-b border-[var(--text)]/10 last:border-0
                                  ${
                                    activeCountryId === country.id
                                      ? "text-[var(--accent)] bg-[var(--accent)]/5 border-l-2 border-[var(--accent)]"
                                      : "text-theme opacity-60 hover:opacity-100 hover:bg-[var(--accent)]/5 border-l-2 border-transparent"
                                  }`}
                    >
                      <Link
                        href={
                          `/${basePath}/${activeRegion.slug}/${country.slug}` as any
                        }
                        onClick={(e) => {
                          if (country.cities.length > 0) e.preventDefault();
                          else {
                            onNavigate();
                            setIsOpen(false);
                          }
                        }}
                        className="flex-1 text-left"
                      >
                        {country.name}
                      </Link>
                      {country.cities.length > 0 && (
                        <ChevronRight className="w-3 h-3 opacity-40 flex-shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Panel nivel 3: ciudades */}
          {activeCountry && activeRegion && (
            <div
              className="fixed top-20 left-0 h-full w-80 z-[10007]
                         bg-gradient-theme border-r border-[var(--text)]/10
                         flex flex-col overflow-hidden
                         animate-in slide-in-from-right-2 duration-250"
            >
              {/* Header con back */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--text)]/10 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveCountryId(null)}
                  className="flex items-center gap-2 text-theme opacity-60 hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span className="text-sm uppercase tracking-wider">
                    {activeRegion.name}
                  </span>
                </button>
                <span className="text-[var(--accent)] text-sm tracking-wider uppercase truncate max-w-[100px]">
                  {activeCountry.name}
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-theme opacity-40 hover:opacity-100 transition-opacity text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Ver país */}
              <Link
                href={
                  `/${basePath}/${activeRegion.slug}/${activeCountry.slug}` as any
                }
                onClick={() => {
                  onNavigate();
                  setIsOpen(false);
                }}
                className="flex items-center justify-between px-4 py-3 text-sm uppercase
                           tracking-wider text-[var(--accent)] border-b border-[var(--text)]/10
                           hover:bg-[var(--accent)]/5 transition-colors flex-shrink-0"
              >
                {locale === "es"
                  ? `Ver todo ${activeCountry.name}`
                  : `See all ${activeCountry.name}`}
                <FaArrowRight className="w-2 h-2" />
              </Link>

              {/* Ciudades label */}
              <div className="px-4 py-2 flex-shrink-0">
                <span className="text-[var(--accent)] text-sm tracking-wider uppercase">
                  {locale === "es" ? "Ciudades" : "Cities"}
                </span>
              </div>

              {/* Lista de ciudades */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--accent)]/20 scrollbar-track-transparent">
                {activeCountry.cities.map((city) => (
                  <Link
                    key={city.id}
                    href={
                      `/${basePath}/${activeRegion.slug}/${activeCountry.slug}/${city.slug}` as any
                    }
                    onClick={() => {
                      onNavigate();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm uppercase
                               tracking-wider text-theme opacity-60 hover:opacity-100
                               hover:text-[var(--accent)] hover:bg-[var(--accent)]/5
                               border-b border-[var(--text)]/10 last:border-0
                               transition-all group"
                  >
                    <span
                      className="w-1 h-1 rounded-full bg-[var(--accent)]/35
                                     group-hover:bg-[var(--accent)] transition-colors flex-shrink-0"
                    />
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────

export function MegaMenuDestinations({
  locale,
  trigger,
  regions,
  isMobile = false,
  mobileLabel,
  onNavigate,
  isDestinationsPanelOpen,
  onDestinationsPanelClose,
}: {
  locale: Locale;
  trigger: React.ReactNode;
  regions: NavRegion[];
  isMobile?: boolean;
  mobileLabel?: string;
  onNavigate?: () => void;
  isDestinationsPanelOpen?: boolean;
  onDestinationsPanelClose?: () => void;
}) {
  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDestinationsPanelClose?.();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onDestinationsPanelClose]);

  // ── Mobile ──────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <MobileAccordion
        locale={locale}
        regions={regions}
        label={mobileLabel ?? (locale === "es" ? "Destinos" : "Destinations")}
        onNavigate={onNavigate ?? (() => {})}
        defaultOpen={isDestinationsPanelOpen ?? false}
      />
    );
  }

  // ── Desktop ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Trigger con tooltip */}
      <div className="relative group hidden md:block">
        <div className="cursor-pointer">{trigger}</div>

        {/* Tooltip */}
        {!isDestinationsPanelOpen && (
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1
                          bg-black/80 text-white text-sm uppercase tracking-wider
                          rounded whitespace-nowrap opacity-0 group-hover:opacity-100
                          transition-opacity duration-200 pointer-events-none"
          >
            {locale === "es" ? "Ver destinos" : "See destinations"}
          </div>
        )}
      </div>

      {/* Panel lateral desktop */}
      {isDestinationsPanelOpen && (
        <DesktopSlidePanel
          locale={locale}
          regions={regions}
          onClose={() => onDestinationsPanelClose?.()}
        />
      )}
    </>
  );
}