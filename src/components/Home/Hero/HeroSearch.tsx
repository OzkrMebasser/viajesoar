"use client";
import { useState, useEffect } from "react";
import { Search, Loader2, Package, MapPin, Globe, Compass } from "lucide-react";
import { useRouter } from "@/app/i18n/navigation";
import type { Locale } from "@/types/locale";
import type { SearchResult } from "@/types/search";
import ButtonArrow from "@/components/ui/ButtonArrow";
import SplitText from "@/components/SplitText";
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
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    router.push(buildHref(result, locale) as any);
    onQueryChange("");
  };

  const placeholder =
    locale === "es"
      ? "Busca destinos, paquetes o tours"
      : "Search destinations, packages or tours";

  return (
    <div className="flex flex-col items-center md:items-start gap-3  ">
      {/* Slogan / eyebrow */}
      <div className="absolute -top-34 lg:relative lg:top-3 backdrop-blur-sm py-1 px-4 rounded-xl inline-block bg-black/5 lg:bg-transparent w-auto">
        <SplitText
          text={
            locale === "es"
              ? `Tu agencia de viajes${isMobile ? "<br/>" : " "}online de confianza`
              : `Your trusted online${isMobile ? "<br/>" : " "}travel agency`
          }
          className=" text-2xl sm:text-xl md:text-4xl lg:text-5xl font-bold  uppercase  leading-tight text-center md:text-left [text-shadow:2px_2px_12px_rgba(0,0,0,1)] "
          delay={25}
          duration={0.5}
          ease="power2.out"
          splitType="words"
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="center"
        />
      </div>
      <div className="mt-8 lg:mt-0 backdrop-blur-xs bg-black/5 lg:bg-transparent p-2 rounded-xl inline-block w-[80%] lg:w-auto">
        <h1 className="uppercase text-xl sm:text-2xl md:text-2xl font-black text-white leading-tight text-center md:text-left [text-shadow:2px_2px_12px_rgba(0,0,0,0.98)] ">
          {locale === "es"
            ? "Paquetes Todo Incluido y Tours Internacionales"
            : "All-Inclusive Packages and International Tours"}
        </h1>
      </div>
      {/* SEO H1 */}

      {/* ── Título SEO ── */}
      <div className="flex flex-col items-center md:items-start gap-2 mb-1 lg:w-[100%] ">
        {/* Supporting copy */}
        {/* <p className=" text-sm sm:text-md md:text-base  text-center md:text-left [text-shadow:1px_1px_8px_rgba(0,0,0,0.8)] max-w-xl">
          {locale === "es"
            ? "Descubre destinos seleccionados, tours y experiencias diseñadas para viajar con confianza."
            : "Discover curated destinations, tours and travel experiences designed with confidence."}
        </p> */}
      </div>

      {/* ── Buscador ── */}
      <div className="relative w-[88vw] sm:w-[450px] md:w-[500px] lg:w-[510px] isolate">
        {/* Input row */}
        <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-2xl">
          <div className="pl-2 lg:pl-5 text-gray-400 flex-shrink-0">
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
            className="flex-1 px-2  text-sm md:text-base text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
          />

          <ButtonArrow
            title={locale === "es" ? "Buscar" : "Search"}
            className="!rounded-md !rounded-l-none !py-2.5 md:!py-5 lg:!py-3  !px-4 lg:!px-5.5 !shadow-none !hover:scale-100"
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
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-[200] max-h-72 overflow-y-auto">
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
                className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
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
