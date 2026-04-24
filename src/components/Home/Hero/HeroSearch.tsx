"use client";
import React from "react";
import { Search, Loader2, Package, MapPin, Globe, Compass } from "lucide-react";
import { useRouter } from "@/app/i18n/navigation";
import type { Locale } from "@/types/locale";
import type { SearchResult } from "@/types/search";
import ButtonArrow from "@/components/ui/ButtonArrow";
// ─── Icons por categoría ───────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<SearchResult["category"], React.ReactNode> = {
  package: <Package className="w-4 h-4" />,
  tour: <Compass className="w-4 h-4" />,
  destination: <MapPin className="w-4 h-4" />,
  country: <Globe className="w-4 h-4" />,
};

function buildHref(result: SearchResult, locale: string): string {
  const base: Record<SearchResult["category"], string> = {
    package: locale === "es" ? "/paquetes" : "/packages",
    tour: "/tours",
    destination: locale === "es" ? "/destinos" : "/destinations",
    country: locale === "es" ? "/destinos" : "/destinations",
  };
  return `${base[result.category]}/${result.slug}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface HeroSearchProps {
  locale: Locale;
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  onQueryChange: (q: string) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────
const HeroSearch = ({
  locale,
  searchQuery,
  searchResults,
  isSearching,
  onQueryChange,
}: HeroSearchProps) => {
  const router = useRouter();

  const handleResultClick = (result: SearchResult) => {
    router.push(buildHref(result, locale) as any);
    onQueryChange("");
  };

  const placeholder =
    locale === "es"
      ? "Busca destinos, paquetes o tours"
      : "Search destinations, packages or tours";

  return (
    <div className="flex flex-col items-center md:items-start gap-3 w-full">
      {/* ── Título SEO ── */}
      <div className="flex flex-col items-center md:items-start gap-1 mb-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight text-center md:text-left [text-shadow:2px_2px_12px_rgba(0,0,0,0.9)]">
          {locale === "es"
            ? "Agencia de viajes y paquetes turísticos"
            : "Travel agency & vacation packages"}
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-medium text-white/90 text-center md:text-left [text-shadow:1px_1px_8px_rgba(0,0,0,0.8)] max-w-lg">
          {locale === "es"
            ? "Encuentra paquetes, tours y destinos al mejor precio. Reserva fácil y viaja seguro."
            : "Find packages, tours and destinations at the best price. Book easy, travel safe."}
        </p>
      </div>

      {/* ── Buscador ── */}
      <div className="relative w-[88vw] sm:w-[480px] md:w-[540px]">
        {/* Input row */}
        <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-2xl">
          <div className="pl-5 text-gray-400 flex-shrink-0">
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-3.5 text-sm md:text-base text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
          />
          {/* <button
            onClick={() => {
              if (!searchQuery.trim()) return;
              const base = locale === "es" ? `/${locale}/destinos` : `/${locale}/destinations`;
              router.push(`${base}?q=${encodeURIComponent(searchQuery)}` as any);
            }}
            className="bg-[#7ac143] hover:bg-[#6aad38] active:bg-[#5a9430] text-white font-bold text-sm md:text-base px-6 py-3.5 transition-colors cursor-pointer flex-shrink-0"
          >
            {locale === "es" ? "Buscar" : "Search"}
          </button> */}
          <ButtonArrow
            title={locale === "es" ? "Buscar" : "Search"}
            className="!rounded-md !rounded-l-none !py-3.5 !px-6 !shadow-none !hover:scale-100"
            onClick={() => {
              if (!searchQuery.trim()) return;
              const base =
                locale === "es"
                  ? `/${locale}/destinos`
                  : `/${locale}/destinations`;
              router.push(
                `${base}?q=${encodeURIComponent(searchQuery)}` as any,
              );
            }}
          />
        </div>

        {/* ── Resultados inline ── */}
        {searchQuery.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto">
            {isSearching && (
              <div className="p-4 text-center text-gray-400">
                <Loader2 className="w-5 h-5 mx-auto animate-spin" />
              </div>
            )}

            {!isSearching && searchResults.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">
                {locale === "es"
                  ? `Sin resultados para "${searchQuery}"`
                  : `No results for "${searchQuery}"`}
              </div>
            )}

            {searchResults.map((result) => (
              <button
                key={`${result.category}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
              >
                {result.image ? (
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400">
                    {CATEGORY_ICONS[result.category]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {result.title}
                  </p>
                  {result.description && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {result.description}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSearch;
