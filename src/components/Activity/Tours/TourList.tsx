"use client";

import { useState, useMemo } from "react";
import type { Locale } from "@/types/locale";
import type { DestinationActivity } from "@/types/activities";
import { t, CategoryIcon, DIFFICULTY_COLOR, DIFFICULTY_LABEL } from "@/types/activities.utils";
import type { Difficulty } from "@/types/activities";
import { Paginator } from "@/components/ui/paginator";
import CardsSlideShow from "@/components/CardsSlideShow";
import ButtonArrow from "@/components/ui/ButtonArrow";
import SplitText from "@/components/SplitText";
import BadgeAccent from "@/components/ui/BadgeAccent";
import ParticlesCanvas from "@/components/ui/Particles/ParticlesCanvas";
import CardParticlesCanvas from "@/components/ui/Particles/CardParticlesCanvas";
import {
  FaSearch,
  FaTimes,
  FaMapMarkerAlt,
  FaClock,
  FaTag,
} from "react-icons/fa";
import { MdTravelExplore } from "react-icons/md";
import { Ticket } from "lucide-react";

interface Props {
  locale: Locale;
  data: DestinationActivity[];
  page: number;
  totalPages: number;
  total: number;
}

export default function TourList({
  locale,
  data,
  page,
  totalPages,
  total,
}: Props) {
  const [query, setQuery] = useState("");

  const normalize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = normalize(query);
    return data.filter(
      (act) =>
        normalize(act.name).includes(q) ||
        normalize(act.category ?? "").includes(q) ||
        act.tags?.some((tag) => normalize(tag).includes(q)) ||
        normalize(act.address ?? "").includes(q),
    );
  }, [query, data]);

  // Hero image: primera actividad con cover_image o foto
  const heroImage =
    data.find((a) => a.cover_image)?.cover_image ??
    data.find((a) => a.photos?.length)?.photos?.[0] ??
    null;


  return (
    <div className="min-h-screen bg-gradient-theme">
      {/* ── HERO ── */}
      <section className="relative h-[80vh] sm:h-[70vh] lg:h-[80vh] flex flex-col justify-end overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          {heroImage ? (
            <img
              src={heroImage}
              alt="tours hero"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20 pt-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <Ticket className="text-[var(--accent)] w-4 h-4" />
            <span className="text-[var(--accent)] text-[11px] tracking-[0.3em] uppercase font-semibold">
              {t(locale, "Excursiones & Actividades", "Tours & Activities")}
            </span>
          </div>

          <SplitText
            text={t(locale, "Experiencias Únicas", "Unique Experiences")}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 uppercase"
            delay={25}
            duration={0.5}
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="left"
          />

          <p className="text-white/70 mt-2 max-w-md text-xs sm:text-sm [text-shadow:2px_2px_3px_#000000]">
            {t(
              locale,
              `${total} tours y actividades disponibles para vivir momentos inolvidables.`,
              `${total} tours and activities available to live unforgettable moments.`,
            )}
          </p>
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <div className="bg-gradient-theme py-5 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative max-w-xl">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] text-sm pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(
                locale,
                "Buscar por nombre, categoría, destino...",
                "Search by name, category, destination...",
              )}
              className="w-full text-[var(--accent)] border border-[var(--accent)] focus:border-[var(--accent)]/60 rounded-sm pl-10 pr-10 py-2.5 text-sm outline-none transition-colors duration-200"
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

      {/* ── GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 bg-gradient-theme">
        {filtered.length === 0 ? (
          /* ── Empty state ── */
          <div className="min-h-[30vh] flex flex-col items-center justify-center gap-4">
            <MdTravelExplore className="text-white/20 text-6xl" />
            <p className="text-white/30 text-sm tracking-widest uppercase">
              {t(locale, "No se encontraron tours", "No tours found")}
            </p>
            <ButtonArrow
              title={t(locale, "Limpiar búsqueda", "Clear search")}
              onClick={() => setQuery("")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ParticlesCanvas />

            {filtered.map((activity) => {
              const images = [
                activity.cover_image,
                ...(activity.photos ?? []),
              ].filter(Boolean) as string[];

              const href = `/${locale}/tours/${activity.slug}`;


              return (
                <article
                  key={activity.id}
                  className="glass-card border border-white/10 rounded-sm overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 group h-full flex flex-col relative"
                >
                  {/* Partículas internas */}
                  <div className="absolute inset-0 opacity-90 pointer-events-none">
                    <CardParticlesCanvas />
                  </div>

                  {/* ── Image ── */}
                  <div className="relative h-56 overflow-hidden flex-shrink-0">
                    {images.length > 0 ? (
                      <CardsSlideShow
                        images={images}
                        interval={4500}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <MdTravelExplore className="text-white/20 text-4xl" />
                      </div>
                    )}

                    {/* Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />

                    {/* Category badge */}
                    {activity.category && (
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <span className="text-[var(--accent)] text-[10px] tracking-[0.25em] uppercase font-semibold border border-white/40 px-2 py-0.5 rounded-sm bg-black/40 backdrop-blur-sm flex items-center gap-1.5">
                          <CategoryIcon
                            category={activity.category}
                            className="text-[0.6rem]"
                          />
                          {activity.category}
                        </span>
                      </div>
                    )}

                    {/* Difficulty badge */}
                    {activity.difficulty_level && (
                      <div className="absolute top-3 right-3 pointer-events-none">
                        <span
                          className={`text-white text-[9px] tracking-widest uppercase font-bold px-2 py-0.5 rounded-sm ${
                            DIFFICULTY_COLOR[activity.difficulty_level as Difficulty] ??
                            "bg-white/20"
                          }`}
                        >
                          {DIFFICULTY_LABEL[activity.difficulty_level as Difficulty]?.[locale] ??
                            activity.difficulty_level}
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    {activity.price !== null && activity.price !== undefined && (
                      <div className="absolute bottom-3 left-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-sm px-4 py-2 pointer-events-none">
                        <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-0.5">
                          {t(locale, "Desde", "From")}
                        </p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[var(--accent)] font-bold text-xl">
                            ${activity.price}
                          </span>
                          <span className="text-white/50 text-xs">USD</span>
                        </div>
                      </div>
                    )}

                    {/* Featured badge */}
                    {activity.is_featured && (
                      <div className="absolute bottom-3 right-3 pointer-events-none">
                        <BadgeAccent>
                          {t(locale, "Destacado", "Featured")}
                        </BadgeAccent>
                      </div>
                    )}
                  </div>

                  {/* ── Content ── */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Title */}
                    <SplitText
                      text={activity.name}
                      className="font-bold text-lg uppercase leading-tight mb-2 text-[var(--accent)]"
                      delay={25}
                      duration={0.5}
                      splitType="chars"
                      from={{ opacity: 0, y: 20 }}
                      to={{ opacity: 1, y: 0 }}
                      textAlign="left"
                    />

                    {/* Description */}
                    {activity.description && (
                      <p className="text-[var(--text)]/80 text-sm leading-relaxed line-clamp-3 mb-4">
                        {activity.description}
                      </p>
                    )}

                    {/* Meta: duration + address */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      {activity.duration && (
                        <div className="flex items-center gap-1.5 text-[var(--text)]/80 text-xs">
                          <FaClock className="text-[var(--accent)]" />
                          <span>
                            <strong className="text-[var(--text)]">
                              {activity.duration}
                            </strong>
                          </span>
                        </div>
                      )}
                      {activity.duration && activity.address && (
                        <span className="text-[var(--accent)]/70">|</span>
                      )}
                      {activity.address && (
                        <div className="flex items-center gap-1.5 text-[var(--text)]/80 text-xs">
                          <FaMapMarkerAlt className="text-[var(--accent)]" />
                          <span className="line-clamp-1">{activity.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {(activity.tags?.length ?? 0) > 0 && (
                      <>
                        <div className="border-t border-theme opacity-45 mb-3" />
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <FaTag className="text-[var(--accent)] text-[0.6rem] mt-0.5 flex-shrink-0" />
                          {activity.tags!.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="text-[var(--text)]/60 text-[10px] uppercase tracking-wide border border-white/10 rounded-sm px-1.5 py-0.5"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Separator */}
                    <div className="border-t border-theme opacity-45 mb-4 mt-auto" />

                    {/* CTA */}
                    <ButtonArrow
                      type="button"
                      href={href}
                      title={t(locale, "Ver tour", "View tour")}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Paginator — solo cuando no hay filtro activo */}
        {!query && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Paginator page={page} totalPages={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
}