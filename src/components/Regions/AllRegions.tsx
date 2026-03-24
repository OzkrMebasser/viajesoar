"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Locale } from "@/types/locale";
import type { DestinationRegion } from "@/types/destinations";

import CardsSlideShow from "@/components/CardsSlideShow";
import SplitText from "@/components/SplitText";
import ButtonArrow from "@/components/ui/ButtonArrow";
import ParticlesCanvas from "../ui/Particles/ParticlesCanvas";
import CardParticlesCanvas from "../ui/Particles/CardParticlesCanvas";

import {
  FaGlobeEurope,
  FaGlobeAmericas,
  FaGlobeAsia,
  FaGlobeAfrica,
  FaSearch,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";
import { GiEarthAmerica, GiPalmTree, GiAztecCalendarSun } from "react-icons/gi";
import { MdTravelExplore } from "react-icons/md";

// ── Icon map (same as PackageList) ──
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaGlobeEurope,
  MdTravelExplore,
  GiEarthAmerica,
  FaGlobeAsia,
  FaGlobeAmericas,
  GiPalmTree,
  FaGlobeAfrica,
  GiAztecCalendarSun,
};

// ── Props ──
interface Props {
  locale: Locale;
  regions: DestinationRegion[];
}

const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

// ── Route helper: /es/destinos/[slug] or /en/destinations/[slug] ──
const regionHref = (locale: Locale, slug: string) =>
  `/${locale === "es" ? "es/destinos" : "en/destinations"}/${slug}`;

// ==============================
// Componente
// ==============================
export default function AllRegions({ locale, regions }: Props) {
  const [query, setQuery] = useState("");

  const normalize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filtered = useMemo(() => {
    if (!query.trim()) return regions;
    const q = normalize(query);
    return regions.filter(
      (r) =>
        normalize(r.name).includes(q) ||
        normalize(r.description ?? "").includes(q),
    );
  }, [query, regions]);
  // Hero: primera imagen de la primera región
  const heroImage =
    Array.isArray(regions[0]?.images) && regions[0].images.length > 0
      ? regions[0].images[0]
      : null;

  return (
    <div className="min-h-screen bg-gradient-theme">
      {/* ── HERO BAND ── */}
      <section className="relative h-[80vh] sm:h-[70vh] lg:h-[80vh] flex flex-col justify-end overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          {heroImage ? (
            <img
              src={heroImage}
              alt="hero"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20 pt-10">
          <SplitText
            text={t(locale, "Explora el Mundo", "Explore the World")}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 uppercase"
            delay={25}
            duration={0.5}
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="center"
          />
          <div className="text-white mt-2 w-full sm:w-80 md:w-140 text-xs sm:text-sm md:text-base md:text-justify [text-shadow:2px_2px_3px_#000000]">
            {t(
              locale,
              "Elige tu región y descubre los destinos más increíbles del planeta.",
              "Choose your region and discover the most incredible destinations on the planet.",
            )}
          </div>
          <p className="text-white/50 text-xs mt-3 tracking-widest uppercase">
            {regions.length}{" "}
            {t(locale, "regiones disponibles", "regions available")}
          </p>
        </div>
      </section>

      {/* ── SEARCH BAR (sticky) ── */}
      <div className="bg-gradient-theme py-5 sticky top-0 z-30 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative max-w-xl">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] text-sm pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(
                locale,
                "Buscar por región...",
                "Search by region...",
              )}
              className="w-full text-[var(--accent)] border border-[var(--accent)] focus:border-[var(--accent)]/60 rounded-sm pl-10 pr-10 py-2.5 text-sm outline-none transition-colors duration-200 bg-transparent"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label={t(locale, "Limpiar búsqueda", "Clear search")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--accent)] hover:text-white/60 transition-colors"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>
          {query && (
            <p className="text-[var(--accent)] text-xs mt-2 tracking-widest uppercase">
              {filtered.length}{" "}
              {t(locale, "resultado(s) encontrado(s)", "result(s) found")}
            </p>
          )}
        </div>
      </div>

      {/* ── REGIONS GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-gradient-theme">
        {/* Section header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-1 h-8 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]`}
            />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
              {t(locale, "Regiones", "Regions")}
            </h2>
          </div>
          <p className="text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
            {t(
              locale,
              "Explora destinos por región",
              "Explore destinations by region",
            )}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="min-h-[30vh] flex flex-col items-center justify-center gap-4">
            <MdTravelExplore className="text-white/20 text-6xl" />
            <p className="text-white/30 text-sm tracking-widest uppercase">
              {t(locale, "No se encontraron regiones", "No regions found")}
            </p>
            <ButtonArrow
              title={t(locale, "Limpiar búsqueda", "Clear search")}
              onClick={() => setQuery("")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ParticlesCanvas />

            {filtered.map((region) => {
              const IconComponent =
                iconMap[region.icon ?? ""] || MdTravelExplore;

              return (
                <article
                  key={region.id}
                  className="glass-card border border-white/10 rounded-sm overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 group h-full flex flex-col relative cursor-pointer"
                >
                  {/* Overlay link — makes the whole card clickeable without nesting <a> */}
                  {/* <Link
                    href={regionHref(locale, region.slug)}
                    className="absolute inset-0 z-10"
                    aria-label={region.name}
                  /> */}

                  {/* Internal particles */}
                  <div className="absolute inset-0 opacity-90 pointer-events-none">
                    <CardParticlesCanvas />
                  </div>

                  {/* ── Image ── */}
                  <div className="relative h-56 overflow-hidden flex-shrink-0">
                    {Array.isArray(region.images) &&
                    region.images.length > 0 ? (
                      <CardsSlideShow
                        images={region.images}
                        interval={4000}
                        className="w-full h-full"
                      />
                    ) : null}

                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />

                    {/* Order badge */}

                    {/* Hover arrow */}
                    <div className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-sm opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                      <FaArrowRight className="h-3.5 w-3.5 text-[var(--accent)]" />
                    </div>
                  </div>

                  {/* ── Content ── */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Icon + Region name */}
                    <div className="flex items-center gap-2 mb-3">
                      <IconComponent className="text-[var(--accent)] text-base flex-shrink-0" />
                      <SplitText
                        text={region.name}
                        className="font-bold text-lg uppercase leading-tight text-theme-tittles"
                        delay={20}
                        duration={0.4}
                        splitType="chars"
                        from={{ opacity: 0, y: 20 }}
                        to={{ opacity: 1, y: 0 }}
                        textAlign="left"
                      />
                    </div>

                    {/* Short description */}
                    {region.description && (
                      <p className="text-[var(--accent)] text-xs tracking-widest uppercase mb-1 font-black">
                        {region.description}
                      </p>
                    )}

                    {/* Long description */}
                    {region.long_description && (
                      <p className="text-[var(--text)]/80 text-sm leading-relaxed line-clamp-3 mb-4">
                        {region.long_description}
                      </p>
                    )}
                    {/* Separator */}
                    <div className="border-t border-theme opacity-45 mb-4" />

                    {/* CTA */}
                    <ButtonArrow
                      type="button"
                      href={regionHref(locale, region.slug)}
                      title={t(locale, "Ver destinos", "View destinations")}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
