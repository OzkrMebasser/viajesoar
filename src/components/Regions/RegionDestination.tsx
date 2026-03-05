"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Locale } from "@/types/locale";
import type { DestinationRegion, DestinationCountry } from "@/types/destinations";

import SplitText from "@/components/SplitText";
import ButtonArrow from "@/components/ui/ButtonArrow";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import CardParticlesCanvas from "@/components/CardParticlesCanvas";

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

interface Props {
  locale: Locale;
  region: DestinationRegion;
  countries: DestinationCountry[];
}

const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

export default function RegionDestination({ locale, region, countries }: Props) {
  const [query, setQuery] = useState("");

const filtered = useMemo(() => {
  if (!query.trim()) return countries;
  const normalize = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const q = normalize(query);
  return countries.filter(
    (c) =>
      normalize(c.name).includes(q) ||
      normalize(c.description ?? "").includes(q)
  );
}, [query, countries]);

  const basePath = locale === "es" ? "destinos" : "destinations";
  const IconComponent = iconMap[region.icon ?? ""] || MdTravelExplore;
  const heroImage =
    Array.isArray(region.images) && region.images.length > 0
      ? region.images[0]
      : region.image ?? null;

  return (
    <div className="min-h-screen bg-gradient-theme">

      {/* ── HERO BAND ── */}
      <section className="relative h-[80vh] sm:h-[70vh] lg:h-[80vh] flex flex-col justify-end overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          {heroImage ? (
            <img
              src={heroImage}
              alt={region.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${
                region.gradient ?? "from-slate-700 to-slate-900"
              }`}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20 pt-10">
          {/* Icon + eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <IconComponent className="text-[var(--accent)] text-xl" />
            <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
              {region.description}
            </span>
          </div>

          <SplitText
            text={region.name}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 uppercase"
            delay={25}
            duration={0.5}
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="left"
          />

          {region.long_description && (
            <div className="text-white/80 mt-2 w-full sm:w-80 md:w-140 text-xs sm:text-sm md:text-base md:text-justify [text-shadow:2px_2px_3px_#000000]">
              {region.long_description}
            </div>
          )}

          <p className="text-white/50 text-xs mt-4 tracking-widest uppercase">
            {countries.length}{" "}
            {t(locale, "países disponibles", "countries available")}
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
              placeholder={t(locale, "Buscar por país...", "Search by country...")}
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

      {/* ── COUNTRIES GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 bg-gradient-theme">

        {/* Section header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${region.gradient ?? "from-slate-500 to-slate-700"}`} />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
              {t(locale, "Países", "Countries")}
            </h2>
          </div>
          <p className="text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
            {t(
              locale,
              "Descubre los destinos disponibles en esta región",
              "Discover the available destinations in this region"
            )}
          </p>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="min-h-[30vh] flex flex-col items-center justify-center gap-4">
            <MdTravelExplore className="text-white/20 text-6xl" />
            <p className="text-white/30 text-sm tracking-widest uppercase">
              {query
                ? t(locale, "No se encontraron países", "No countries found")
                : t(locale, "Aún no hay países disponibles en esta región", "No countries available in this region yet")}
            </p>
            {query ? (
              <ButtonArrow
                title={t(locale, "Limpiar búsqueda", "Clear search")}
                onClick={() => setQuery("")}
              />
            ) : (
              <p className="text-white/20 text-xs">
                {t(locale, "Pronto agregaremos nuevos destinos ✈️", "We're adding new destinations soon ✈️")}
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ParticlesCanvas />

            {filtered.map((country) => (
              <article
                key={country.id}
                className="glass-card border border-white/10 rounded-sm overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 group h-full flex flex-col relative cursor-pointer"
              >
                {/* Overlay link */}
                <Link
                  href={`/${locale}/${basePath}/${region.slug}/${country.slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={country.name}
                />

                {/* Internal particles */}
                <div className="absolute inset-0 opacity-90 pointer-events-none">
                  <CardParticlesCanvas />
                </div>

                {/* ── Image ── */}
                <div className="relative h-56 overflow-hidden flex-shrink-0">
                  <img
                    src={country.image}
                    alt={country.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Hover arrow */}
                  <div className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-sm opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                    <FaArrowRight className="h-3.5 w-3.5 text-[var(--accent)]" />
                  </div>

                  {/* Gradient accent strip usando el color de la región */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
                      region.gradient ?? "from-slate-600 to-slate-800"
                    } opacity-80`}
                  />
                </div>

                {/* ── Content ── */}
                <div className="p-5 flex flex-col flex-1">
                  <SplitText
                    text={country.name}
                    className="font-bold text-lg uppercase leading-tight text-theme-tittles mb-2"
                    delay={20}
                    duration={0.4}
                    splitType="chars"
                    from={{ opacity: 0, y: 20 }}
                    to={{ opacity: 1, y: 0 }}
                    textAlign="left"
                  />

                  {country.description && (
                    <p className="text-[var(--accent)] text-sm leading-relaxed line-clamp-3 mb-4">
                      {country.description}
                    </p>
                  )}

                  {/* Separator */}
                  <div className="border-t border-theme opacity-45 mb-4" />

                  {/* CTA */}
                  <div className="relative z-20">
                    <ButtonArrow
                      type="button"
                      href={`/${locale}/${basePath}/${region.slug}/${country.slug}`}
                      title={t(locale, "Ver país", "View country")}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}