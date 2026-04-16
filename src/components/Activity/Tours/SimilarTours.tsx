"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaClock, FaStar, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import { MdTravelExplore } from "react-icons/md";
import type { DestinationActivity } from "@/types/activities";
import {
  CategoryIcon,
  DIFFICULTY_COLOR,
  DIFFICULTY_LABEL,
} from "@/types/activities.utils";
import type { Difficulty } from "@/types/activities";
import CardsSlideShow from "@/components/CardsSlideShow";
import ButtonArrow from "@/components/ui/ButtonArrow";
import BadgeAccent from "@/components/ui/BadgeAccent";
import CardParticlesCanvas from "@/components/ui/Particles/CardParticlesCanvas";

type Locale = "es" | "en";
const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

interface Props {
  tours: DestinationActivity[];
  locale: Locale;
  cityName?: string;
}

export default function SimilarTours({ tours = [], locale, cityName }: Props) {
  const router = useRouter();

  if (!tours.length) return null;

  return (
    <>
      <div className="border-t border-theme opacity-45 mt-8" />
      <div className="py-10">
        {/* Eyebrow heading */}
        {/* <div className="flex items-center gap-2 mb-6 px-1">
          <span className="text-[var(--accent)] text-xs tracking-widest uppercase ">
            {cityName
              ? t(locale, `Otros tours en ${cityName}`, `More tours in ${cityName}`)
              : t(locale, "Tours similares", "Similar tours")}
          </span>
        </div> */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]/40" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
              {cityName
                ? t(
                    locale,
                    `Más tours en ${cityName}`,
                    `More tours in ${cityName}`,
                  )
                : t(locale, "Más tours", "More tours")}
            </h2>
          </div>
          <p className="text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
            {t(
              locale,
              "Descubre más experiencias",
              "Discover more experiences",
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => {
            const images = [tour.cover_image, ...(tour.photos ?? [])].filter(
              Boolean,
            ) as string[];

            const href = `/${locale}/tours/${tour.slug}`;

            return (
              <article
                key={tour.id}
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
                  {tour.category && (
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="text-[var(--accent)] text-[10px] tracking-[0.25em] uppercase font-semibold border border-white/40 px-2 py-0.5 rounded-sm bg-black/40 backdrop-blur-sm flex items-center gap-1.5">
                        <CategoryIcon
                          category={tour.category}
                          className="text-[0.6rem]"
                        />
                        {tour.category}
                      </span>
                    </div>
                  )}

                  {/* Difficulty badge */}
                  {tour.difficulty_level && (
                    <div className="absolute top-3 right-3 pointer-events-none">
                      <span
                        className={`text-white text-[9px] tracking-widest uppercase font-bold px-2 py-0.5 rounded-sm ${
                          DIFFICULTY_COLOR[
                            tour.difficulty_level as Difficulty
                          ] ?? "bg-white/20"
                        }`}
                      >
                        {DIFFICULTY_LABEL[
                          tour.difficulty_level as Difficulty
                        ]?.[locale] ?? tour.difficulty_level}
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  {tour.price !== null && tour.price !== undefined && (
                    <div className="absolute bottom-3 left-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-sm px-4 py-2 pointer-events-none">
                      <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-0.5">
                        {t(locale, "Desde", "From")}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[var(--accent)] font-bold text-xl">
                          ${Number(tour.price).toLocaleString()}
                        </span>
                        <span className="text-white/50 text-xs">
                          {tour.currency ?? "USD"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Featured badge */}
                  {tour.is_featured && (
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
                  <p className="font-bold text-lg uppercase leading-tight mb-2 text-[var(--accent)]">
                    {tour.name}
                  </p>

                  {/* Description */}
                  {tour.description && (
                    <p className="text-[var(--text)]/80 text-sm leading-relaxed line-clamp-3 mb-4">
                      {tour.description}
                    </p>
                  )}

                  {/* Meta: duration + address */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {tour.duration && (
                      <div className="flex items-center gap-1.5 text-[var(--text)]/80 text-xs">
                        <FaClock className="text-[var(--accent)]" />
                        <span>
                          <strong className="text-[var(--text)]">
                            {tour.duration}
                          </strong>
                        </span>
                      </div>
                    )}
                    {tour.duration && tour.address && (
                      <span className="text-[var(--accent)]/70">|</span>
                    )}
                    {tour.address && (
                      <div className="flex items-center gap-1.5 text-[var(--text)]/80 text-xs">
                        <FaMapMarkerAlt className="text-[var(--accent)]" />
                        <span className="line-clamp-1">{tour.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {(tour.tags?.length ?? 0) > 0 && (
                    <>
                      <div className="border-t border-theme opacity-45 mb-3" />
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <FaTag className="text-[var(--accent)] text-[0.6rem] mt-0.5 flex-shrink-0" />
                        {tour.tags!.slice(0, 3).map((tag, i) => (
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
      </div>
    </>
  );
}
