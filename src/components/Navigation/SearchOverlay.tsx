"use client";
import React, { useEffect, useRef } from "react";
import { Search, Loader2, Package, MapPin, Globe, Compass, WifiOff } from "lucide-react";
import type { SearchResult, SearchLocale } from "@/types/search";
import { useRouter } from "@/app/i18n/navigation";

// ─── Constantes de UI ─────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<SearchResult["category"], Record<SearchLocale, string>> = {
  package:     { es: "Paquete", en: "Package"     },
  tour:        { es: "Tour",    en: "Tour"         },
  destination: { es: "Destino", en: "Destination"  },
  country:     { es: "País",    en: "Country"      },
};

const CATEGORY_ICONS: Record<SearchResult["category"], React.ReactNode> = {
  package:     <Package   className="w-4 h-4" />,
  tour:        <Compass   className="w-4 h-4" />,
  destination: <MapPin    className="w-4 h-4" />,
  country:     <Globe     className="w-4 h-4" />,
};

const POPULAR: Record<SearchLocale, string[]> = {
  es: ["Cancún", "Europa", "Safari", "Caribe", "Asia"],
  en: ["Cancún", "Europe", "Safari", "Caribbean", "Asia"],
};

// ─── buildHref — misma lógica que los routes ─────────────────────────────────
// Categorías y slugs de base están alineados con lo que devuelven
// /api/search y /api/search/all

function buildHref(result: SearchResult, locale: SearchLocale): string {
  const base: Record<SearchResult["category"], string> = {
    package:     locale === "es" ? "/paquetes"  : "/packages",
    tour:        "/tours",
    destination: locale === "es" ? "/destinos"  : "/destinations",
    country:     locale === "es" ? "/destinos"  : "/destinations",
  };
  return `${base[result.category]}/${result.slug}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SearchOverlayProps {
  isSearchOpen:  boolean;
  searchQuery:   string;
  searchResults: SearchResult[];
  isSearching:   boolean;
  loadStatus:    "idle" | "loading" | "ready" | "error";
  locale:        SearchLocale;
  setSearchQuery: (q: string) => void;
  closeSearch:   () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isSearchOpen,
  searchQuery,
  searchResults,
  isSearching,
  loadStatus,
  locale,
  setSearchQuery,
  closeSearch,
}) => {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // ── Focus al abrir ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  const handleResultClick = (result: SearchResult) => {
    router.push(buildHref(result, locale) as any);
    closeSearch();
  };

  // ── Estado de carga inicial ───────────────────────────────────────────────
  const showInitialLoader = isSearchOpen && loadStatus === "loading" && searchQuery.length === 0;

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 text-theme ${
        isSearchOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-sm" onClick={closeSearch} />

      {/* Panel */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 mt-16">
        <div className="rounded-2xl shadow-2xl overflow-hidden bg-theme">

          {/* ── Input ── */}
          <div className="p-6">
            <div className="relative">
              {isSearching ? (
                <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin opacity-50" />
              ) : (
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
              )}
              <input
                ref={searchInputRef}
                type="text"
                placeholder={
                  locale === "es"
                    ? "Buscar destinos, paquetes, tours…"
                    : "Search destinations, packages, tours…"
                }
                className="w-full pl-12 pr-4 py-4 text-lg border-0 focus:outline-none focus:ring-0 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Banner modo fallback — avisa que está usando búsqueda en servidor */}
            {loadStatus === "error" && searchQuery.length >= 2 && (
              <p className="flex items-center gap-1.5 mt-2 text-xs opacity-50">
                <WifiOff className="w-3 h-3" />
                {locale === "es"
                  ? "Usando búsqueda en servidor"
                  : "Using server-side search"}
              </p>
            )}
          </div>

          {/* ── Cargando precarga inicial ── */}
          {showInitialLoader && (
            <div className="p-8 text-center opacity-40">
              <Loader2 className="w-6 h-6 mx-auto animate-spin" />
            </div>
          )}

          {/* ── Resultados ── */}
          {searchResults.length > 0 && (
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
              {searchResults.map((result) => (
                <button
                  key={`${result.category}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200 flex items-center gap-3"
                >
                  {result.image ? (
                    <img
                      src={result.image}
                      alt={result.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center flex-shrink-0 text-gray-400">
                      {CATEGORY_ICONS[result.category]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{result.title}</p>
                    {result.description && (
                      <p className="text-sm opacity-60 truncate mt-0.5">
                        {result.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 px-2 py-0.5 rounded-full">
                      {CATEGORY_LABELS[result.category][locale]}
                    </span>
                    {result.price != null && (
                      <span className="text-xs font-medium opacity-70">
                        {result.currency ?? "USD"}{" "}
                        {result.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── Sin resultados ── */}
          {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
            <div className="p-8 text-center opacity-60">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">
                {locale === "es"
                  ? `Sin resultados para "${searchQuery}"`
                  : `No results for "${searchQuery}"`}
              </p>
              <p className="text-sm mt-1">
                {locale === "es"
                  ? "Prueba con otras palabras"
                  : "Try different keywords"}
              </p>
            </div>
          )}

          {/* ── Búsquedas populares ── */}
          {searchQuery.length === 0 && !showInitialLoader && (
            <div className="p-6">
              <h3 className="font-semibold opacity-60 mb-4 text-sm uppercase tracking-wide">
                {locale === "es" ? "Búsquedas populares" : "Popular searches"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR[locale].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSearchQuery(s)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-white/10 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};