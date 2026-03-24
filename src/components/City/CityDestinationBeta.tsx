"use client";

import { useState, useMemo } from "react";
import type { Locale } from "@/types/locale";
import type { DestinationCountry, Destination } from "@/types/destinations";
import type { DestinationActivity } from "@/types/activities";

import SplitText from "@/components/SplitText";
import ButtonArrow from "@/components/ui/ButtonArrow";
import ParticlesCanvas from "@/components/ui/Particles/ParticlesCanvas";
import CardParticlesCanvas from "@/components/ui/Particles/CardParticlesCanvas";
import CardsSlideShow from "@/components/CardsSlideShow";

import { FaSearch, FaTimes, FaArrowRight, FaTag, FaGlobe, FaClock, FaStar } from "react-icons/fa";
import { MdTravelExplore } from "react-icons/md";

interface Props {
  locale: Locale;
  regionSlug: string;
  country: DestinationCountry;
  city: Destination;
  activities: DestinationActivity[];
}

const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

export default function CityDestinationBeta({
  locale,
  regionSlug,
  country,
  city,
  activities,
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return activities;
    const normalize = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    const q = normalize(query);
    return activities.filter(
      (a) =>
        normalize(a.name).includes(q) ||
        normalize(a.description ?? "").includes(q) ||
        normalize(a.category ?? "").includes(q),
    );
  }, [query, activities]);

  const basePath = locale === "es" ? "destinos" : "destinations";

  return (
    <div className="min-h-screen bg-gradient-theme">
      {/* ── HERO BAND ── */}
      <section className="relative h-[80vh] sm:h-[70vh] lg:h-[80vh] flex flex-col justify-end overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          {Array.isArray(city.images) && city.images.length > 0 ? (
            <CardsSlideShow
              images={city.images}
              interval={5000}
              className="w-full h-full"
            />
          ) : city.image ? (
            <img
              src={city.image}
              alt={city.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20 pt-10">
          {/* Eyebrow */}
          {city.description && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
                {city.description}
              </span>
            </div>
          )}

          <SplitText
            text={city.name}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 uppercase"
            delay={25}
            duration={0.5}
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="left"
          />

          {/* País */}
          <p className="text-white/60 text-sm flex items-center gap-1.5 mt-1 mb-2">
            <FaGlobe className="text-[var(--accent)] text-xs" />
            {country.name}
          </p>

          {city.long_description && (
            <div className="text-white/80 mt-2 w-full sm:w-80 md:w-140 text-xs sm:text-sm md:text-base md:text-justify [text-shadow:2px_2px_3px_#000000]">
              {city.long_description}
            </div>
          )}

          {/* Highlights */}
          {Array.isArray(city.highlights) && city.highlights.length > 0 && (
            <ul className="flex flex-col gap-1.5 mt-4">
              {city.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="animate-pulse mt-[6px] w-1.5 h-1.5 bg-[var(--accent)]/60 shadow-[0_0_6px_var(--accent)] flex-shrink-0" />
                  <span className="text-white/70 text-xs leading-relaxed">
                    {highlight}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <p className="text-white/50 text-xs mt-4 tracking-widest uppercase">
            {activities.length}{" "}
            {t(locale, "actividades disponibles", "activities available")}
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
                "Buscar actividad...",
                "Search activity...",
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

      {/* ── ACTIVITIES GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-gradient-theme">
        {/* Section header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
              {t(locale, "Actividades", "Activities")}
            </h2>
          </div>
          <p className="text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
            {t(
              locale,
              `Explora lo mejor de ${city.name}`,
              `Explore the best of ${city.name}`,
            )}
          </p>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="min-h-[30vh] flex flex-col items-center justify-center gap-4">
            <MdTravelExplore className="text-white/20 text-6xl" />
            <p className="text-white/30 text-sm tracking-widest uppercase">
              {query
                ? t(locale, "No se encontraron actividades", "No activities found")
                : t(
                    locale,
                    "Aún no hay actividades disponibles en esta ciudad",
                    "No activities available in this city yet",
                  )}
            </p>
            {query ? (
              <ButtonArrow
                title={t(locale, "Limpiar búsqueda", "Clear search")}
                onClick={() => setQuery("")}
              />
            ) : (
              <p className="text-white/20 text-xs">
                {t(
                  locale,
                  "Pronto agregaremos nuevas actividades ✈️",
                  "We're adding new activities soon ✈️",
                )}
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ParticlesCanvas />

            {filtered.map((activity) => (
              <article
                key={activity.id}
                className="glass-card border border-white/10 rounded-sm overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 group h-full flex flex-col relative cursor-pointer"
              >
                {/* Internal particles */}
                <div className="absolute inset-0 opacity-90 pointer-events-none">
                  <CardParticlesCanvas />
                </div>

                {/* ── Image ── */}
                <div className="relative h-56 overflow-hidden flex-shrink-0">
                  {Array.isArray(activity.photos) && activity.photos.length > 0 ? (
                    <CardsSlideShow
                      images={activity.photos}
                      interval={4000}
                      className="w-full h-full"
                    />
                  ) : activity.cover_image ? (
                    <img
                      src={activity.cover_image}
                      alt={activity.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : null}

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Category badge */}
                  {activity.category && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm border border-white/10 rounded-sm">
                      <span className="text-[var(--accent)] text-[10px] tracking-widest uppercase font-semibold">
                        {activity.category}
                      </span>
                    </div>
                  )}

                  {/* Featured badge */}
                  {activity.is_featured && (
                    <div className="absolute top-3 right-3 p-1.5 bg-[var(--accent)]/20 backdrop-blur-sm border border-[var(--accent)]/30 rounded-sm">
                      <FaStar className="h-3 w-3 text-[var(--accent)]" />
                    </div>
                  )}

                  {/* Hover arrow — solo si no es featured */}
                  {!activity.is_featured && (
                    <div className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-sm opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                      <FaArrowRight className="h-3.5 w-3.5 text-[var(--accent)]" />
                    </div>
                  )}

                  {/* Accent strip */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/40 opacity-80" />
                </div>

                {/* ── Content ── */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <MdTravelExplore className="text-[var(--accent)] text-base flex-shrink-0" />
                    <SplitText
                      text={activity.name}
                      className="font-bold text-base uppercase leading-tight text-theme-tittles"
                      delay={20}
                      duration={0.4}
                      splitType="chars"
                      from={{ opacity: 0, y: 20 }}
                      to={{ opacity: 1, y: 0 }}
                      textAlign="left"
                    />
                  </div>

                  {/* Meta row: duración + precio */}
                  <div className="flex items-center gap-3 mb-3">
                    {activity.duration && (
                      <span className="flex items-center gap-1 text-[var(--accent)] text-xs tracking-widest uppercase font-black">
                        <FaClock className="text-[10px]" />
                        {activity.duration}
                      </span>
                    )}
                    {(activity.price_from ?? activity.price) && (
                      <span className="flex items-center gap-1 text-[var(--accent)] text-xs tracking-widest uppercase font-black">
                        <FaTag className="text-[10px]" />
                        {t(locale, "Desde", "From")}{" "}
                        {activity.currency ?? "USD"}{" "}
                        {activity.price_from ?? activity.price}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[var(--text)]/70 text-sm leading-relaxed line-clamp-3 mb-3">
                    {activity.description}
                  </p>

                  {/* Included */}
                  {Array.isArray(activity.included) && activity.included.length > 0 && (
                    <ul className="flex flex-col gap-1.5 mb-4">
                      {activity.included.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="animate-pulse mt-[6px] w-1.5 h-1.5 bg-[var(--accent)]/60 shadow-[0_0_6px_var(--accent)] flex-shrink-0" />
                          <span className="text-[var(--text)]/70 text-xs leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tags */}
                  {Array.isArray(activity.tags) && activity.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {activity.tags.slice(0, 4).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[10px] tracking-wide uppercase border border-[var(--accent)]/30 text-[var(--accent)]/70 rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Separator */}
                  <div className="border-t border-theme opacity-45 mb-4 mt-auto" />

                  {/* CTA */}
                  <div className="relative z-20">
                    {activity.booking_url ? (
                      <ButtonArrow
                        type="button"
                        href={activity.booking_url}
                        title={t(locale, "Reservar", "Book now")}
                      />
                    ) : (
                      <ButtonArrow
                        type="button"
                        href={`/${locale}/${basePath}/${regionSlug}/${country.slug}/${city.slug}/${activity.slug}`}
                        title={t(locale, "Ver actividad", "View activity")}
                      />
                    )}
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