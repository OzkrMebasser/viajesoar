"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Locale } from "@/types/locale";
import type { Package } from "@/types/packages";
import { Paginator } from "@/components/ui/paginator";
import {
  FaEuroSign,
  FaGlobeEurope,
  FaGlobeAmericas,
  FaGlobeAsia,
  FaGlobeAfrica,
} from "react-icons/fa";
import { GiEarthAmerica, GiPalmTree, GiAztecCalendarSun } from "react-icons/gi";

import CardsSlideShow from "@/components/CardsSlideShow";
import ButtonGlower from "@/components/ui/ButtonGlower";
import ButtonArrow from "@/components/ui/ButtonArrow";
import SplitText from "@/components/SplitText";
import {
  FaPlane,
  FaMoon,
  FaSun,
  FaMapMarkerAlt,
  FaUsers,
  FaGlobe,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { MdTravelExplore } from "react-icons/md";
import ParticlesCanvas from "../ParticlesCanvas";

const iconMap: Record<string, React.ComponentType<any>> = {
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
  packages: Package[];
  page: number;
  totalPages: number;
}

const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

export default function PackageList({
  locale,
  packages,
  page,
  totalPages,
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return packages;
    const q = query.toLowerCase();
    return packages.filter(
      (pkg) =>
        pkg.name.toLowerCase().includes(q) ||
        pkg.visited_countries?.some((c) => c.name.toLowerCase().includes(q)) ||
        pkg.visited_cities?.some((c) => c.name.toLowerCase().includes(q)),
    );
  }, [query, packages]);

  return (
    <div className="min-h-screen bg-gradient-theme">
      {/* ── HERO BAND ── */}
      <section className="relative h-[80vh] sm:h-[70vh] lg:h-[80vh] flex flex-col justify-end overflow-hidden text-white">
        {/* Background image — uses first package image as hero */}
        <div className="absolute inset-0 z-0">
          {packages[0]?.home_carousel_images?.[0] ? (
            <img
              src={packages[0].home_carousel_images[0]}
              alt="hero"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full  px-4 sm:px-6 pb-20 pt-10 ">
          {/* <div className="w-8 h-0.5 sm:w-6 sm:h-0.5 md:w-24 md:h-1 rounded-full bg-white [box-shadow:2px_2px_3px_#000000]" /> */}

          <SplitText
            text={t(locale, "Paquetes Imperdibles", "Unmissable Travel Deals")}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold  mb-3 uppercase"
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
              "Viaja a los destinos más increíbles, todo organizado para ti.",
              "Travel to the most incredible destinations, fully organized for you.",
            )}
          </div>
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <div className="bg-gradient-theme  py-5 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative max-w-xl">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] text-sm pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(
                locale,
                "Buscar por nombre, país o ciudad...",
                "Search by name, country or city...",
              )}
              className="w-full text-[var(--accent)] border border-[var(--accent)] focus:border-[var(--accent)]/60 rounded-sm pl-10 pr-10 py-2.5   text-sm outline-none transition-colors duration-200"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
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

      {/* ── PACKAGE GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 bg-gradient-theme">
        {filtered.length === 0 ? (
          <div className="min-h-[30vh] flex flex-col items-center justify-center gap-4 ">
            <MdTravelExplore className="text-white/20 text-6xl" />
            <p className="text-white/30 text-sm tracking-widest uppercase">
              {t(locale, "No se encontraron paquetes", "No packages found")}
            </p>
            <ButtonArrow
              title={t(locale, "Limpiar búsqueda", "Clear search")}
              onClick={() => setQuery("")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            <ParticlesCanvas />
            {filtered.map((pkg) => (
              <article
                key={pkg.id}
                className="glass-card   border border-white/10 rounded-sm overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 group h-full flex flex-col"
              >
                {/* ── Image slideshow ── */}
                <div className="relative h-56 overflow-hidden flex-shrink-0 ">
                  <CardsSlideShow
                    images={pkg.home_carousel_images || []}
                    interval={4000}
                    className="w-full h-full"
                  />
                  {/* Gradient overlays — same as PackagePage hero */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Eyebrow badge */}
                  {pkg.internal_pkg_id ? (
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="text-white/60 text-[10px] tracking-[0.25em] uppercase font-semibold border border-white/40 px-2 py-0.5 rounded-sm bg-black/40 backdrop-blur-sm">
                        {pkg.internal_pkg_id}
                      </span>
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="text-[var(--accent)] text-[10px] tracking-[0.25em] uppercase font-semibold border border-[var(--accent)]/40 px-2 py-0.5 rounded-sm bg-black/40 backdrop-blur-sm">
                        VS-0000
                      </span>
                    </div>
                  )}

                  {/* Price card — same as PackagePage hero */}
                  <div className="absolute bottom-3 left-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-sm px-4 py-2 pointer-events-none">
                    <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-0.5">
                      {t(locale, "Desde", "From")}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[var(--accent)] font-bold text-xl">
                        ${Number(pkg.price_from).toLocaleString()}
                      </span>
                      <span className="text-white/50 text-xs">
                        {pkg.currency}
                      </span>
                      <br />
                      <div className="text-white/40 text-xs mt-1">
                        + ${Number(pkg.taxes).toLocaleString()}{" "}
                        {t(locale, "impuestos ", "taxes")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Content ── */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Title */}
                  {/* <h2 className="text-white font-bold text-lg uppercase leading-tight mb-2 text-theme-tittles">
                    {pkg.name}
                  </h2> */}
                  <SplitText
                    text={pkg.name}
                    className="text-white font-bold text-lg uppercase leading-tight mb-2 text-theme-tittles "
                    delay={25}
                    duration={0.5}
                    splitType="chars"
                    from={{ opacity: 0, y: 20 }}
                    to={{ opacity: 1, y: 0 }}
                    textAlign="left"
                  />

                  {/* Description */}
                  {pkg.description && (
                    <p className="text-[var(--accent)] text-sm md:text-lg  leading-relaxed line-clamp-2 ">
                      {pkg.description}
                    </p>
                  )}

                  {/* Meta badges — same dot-separator pattern as PackagePage hero */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {pkg.days && (
                      <div className="flex items-center gap-1.5 text-white/70 text-xs">
                        <FaSun className="text-[var(--accent)]" />
                        <span>
                          <strong className="text-white">{pkg.days}</strong>{" "}
                          {t(locale, "días", "days")}
                        </span>
                      </div>
                    )}
                    {pkg.days && pkg.nights && (
                      <div className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                    )}
                    {pkg.nights && (
                      <div className="flex items-center gap-1.5 text-white/70 text-xs">
                        <FaMoon className="text-[var(--accent)]" />
                        <span>
                          <strong className="text-white">{pkg.nights}</strong>{" "}
                          {t(locale, "noches", "nights")}
                        </span>
                      </div>
                    )}
                    {pkg.includes_flight && (
                      <>
                        <div className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                        <div className="flex items-center gap-1.5 text-white/70 text-xs">
                          <FaPlane className="text-[var(--accent)]" />
                          <span>{t(locale, "Vuelo inc.", "Flight inc.")}</span>
                        </div>
                      </>
                    )}
                    {/* {pkg.min_passengers && (
                      <>
                        <div className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                        <div className="flex items-center gap-1.5 text-white/70 text-xs">
                          <FaUsers className="text-[var(--accent)]" />
                          <span>
                            {t(locale, "Mín.", "Min.")} {pkg.min_passengers}{" "}
                            {t(locale, "pax", "pax")}
                          </span>
                        </div>
                      </>
                    )} */}
                  </div>

                  {/* Separator */}
                  <div className="border-t border-white/5 mb-4 mt-auto" />

                  {/* ── Region + Flags ── */}
                  <div className="mb-3">
                    {/* Region */}
                    {/* {pkg.region && (
                      <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">
                        {pkg.region.name}
                      </div>
                    )} */}
                    {pkg.region &&
                      (() => {
                        const IconComponent =
                          iconMap[pkg.region.icon ?? ""] || MdTravelExplore;

                        return (
                          <div className="flex items-center gap-2 mb-1">
                            <IconComponent className="text-[var(--accent)] text-xs" />
                            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                              {pkg.region.name}
                            </span>
                          </div>
                        );
                      })()}

                    {/* Flags */}
                    {pkg.visited_countries?.length > 0 && (
                      <div className="flex items-center gap-[3px]">
                        {pkg.visited_countries.map((c) =>
                          c.country_code ? (
                            <span
                              key={c.id}
                              className={`fi fi-${c.country_code.toLowerCase()} w-5 h-4 `}
                            />
                          ) : null,
                        )}
                      </div>
                    )}
                  </div>
                  {/* Locations — same as PackagePage sidebar quick-info */}

                  <div className="space-y-2 mb-5">
                    {pkg.visited_countries?.length > 0 && (
                      <div className="flex items-center gap-3 text-xs text-[var(--accent)]">
                        <FaGlobe className="text-[var(--accent)] flex-shrink-0" />
                        <span className="line-clamp-1">
                          {pkg.visited_countries.map((c) => c.name).join(" · ")}
                        </span>
                      </div>
                    )}
                    {pkg.visited_cities?.length > 0 && (
                      <div className="flex items-center gap-3 text-xs text-[var(--accent)]">
                        <FaMapMarkerAlt className="text-[var(--accent)] flex-shrink-0" />
                        <span className="line-clamp-1">
                          {pkg.visited_cities.map((c) => c.name).join(" · ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <ButtonArrow
                    type="button"
                    href={`/${locale === "es" ? "es/paquetes" : "en/packages"}/${pkg.slug}`}
                    title={t(locale, "Ver paquete", "View package")}
                  />
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Paginator — only when not filtering */}
        {!query && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Paginator page={page} totalPages={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
}
