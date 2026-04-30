"use client";

import { useState, useMemo } from "react";

import type { DestinationCountry, Destination } from "@/types/destinations";
import type { DestinationActivity } from "@/types/activities";
import type { Package } from "@/types/packages";

import SplitText from "@/components/SplitText";
import ButtonArrow from "@/components/ui/ButtonArrow";
import CardsSlideShow from "@/components/CardsSlideShow";
import ImageGalleryModal from "@/components/ui/Modals/ImageGalleryModal";
import CardParticlesCanvas from "@/components/ui/Particles/CardParticlesCanvas";

import DesktopCardActivity from "@/components/Activity/DesktopCardActivity";
import MobileCardActivity from "@/components/Activity/MobileCardActivity";
import { t, type Locale } from "@/types/activities.utils";

import {
  FaSearch,
  FaTimes,
  FaGlobe,
  FaPlane,
  FaMoon,
  FaSun,
  FaMapMarkerAlt,
  FaGlobeEurope,
  FaGlobeAmericas,
  FaGlobeAsia,
  FaGlobeAfrica,
} from "react-icons/fa";
import { GiEarthAmerica, GiPalmTree, GiAztecCalendarSun } from "react-icons/gi";
import { MdTravelExplore } from "react-icons/md";

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
  countryName: string;
  regionSlug: string;
  country: DestinationCountry;
  city: Destination;
  activities: DestinationActivity[];
  cityPackages: Package[];
}

export default function CityDestination({
  locale,
  countryName,
  regionSlug,
  country,
  city,
  activities,
  cityPackages,
}: Props) {
  const [query, setQuery] = useState("");
  const [activeDesktop, setActiveDesktop] = useState<string | null>(
    activities[0]?.id ?? null,
  );
  const [activeMobile, setActiveMobile] = useState<string | null>(null);
  const [galleryActivity, setGalleryActivity] =
    useState<DestinationActivity | null>(null);

  const basePath = locale === "es" ? "destinos" : "destinations";
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

  return (
    <section className="min-h-screen bg-gradient-theme">
      {/* Gallery modal */}
      <ImageGalleryModal
        headless
        images={
          galleryActivity
            ? ([
                galleryActivity.cover_image,
                ...(galleryActivity.photos ?? []),
              ].filter(Boolean) as string[])
            : []
        }
        title={galleryActivity?.name}
        open={!!galleryActivity}
        onClose={() => setGalleryActivity(null)}
      />
      {/* ── CITY INFO ── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-6 pb-0 lg:pb-8 text-white">
        {" "}
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
        <p className="text-white/60 text-sm flex items-center gap-1.5 mt-1 mb-2">
          <FaGlobe className="text-[var(--accent)] text-xs" />
          {country.name}
        </p>
        {city.long_description && (
          <div className="text-white/80 mt-2 w-full sm:w-80 md:w-140 text-xs sm:text-sm md:text-base md:text-justify [text-shadow:2px_2px_3px_#000000]">
            {city.long_description}
          </div>
        )}
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
      {/* ── HERO BAND ── */}
      <div className="relative h-[100dvh] flex flex-col justify-end overflow-hidden text-white ">
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
      </div>
      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 cursor-pointer"
        onClick={() =>
          document
            .getElementById("activities-search")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase">
          scroll
        </span>
        {[0, 0.2].map((delay, i) => (
          <div
            key={i}
            className="w-3 h-3 border-r border-b border-white/60"
            style={{
              transform: "rotate(45deg)",
              animation: "chevBounce 1.4s ease-in-out infinite",
              animationDelay: `${delay}s`,
            }}
          />
        ))}
        <style>{`
    @keyframes chevBounce {
      0%   { translate: 0 0px;  opacity: 0.3; }
      50%  { translate: 0 5px;  opacity: 1; }
      100% { translate: 0 0px;  opacity: 0.3; }
    }
  `}</style>
      </div>

      {/* ── ACTIVITIES GRID ── */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-gradient-theme"
        id="activities-search"
      >
        {/* Section header */}
        <div className="mb-4 pt-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]/40" />
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
        {/* ── SEARCH BAR (sticky) ── */}
        <div className="bg-gradient-theme pb-8 z-30 backdrop-blur-md border-b border-white/5">
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

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="min-h-[30vh] flex flex-col items-center justify-center gap-4">
            <MdTravelExplore className="text-white/20 text-6xl" />
            <p className="text-white/30 text-sm tracking-widest uppercase">
              {query
                ? t(
                    locale,
                    "No se encontraron actividades",
                    "No activities found",
                  )
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
          <>
            {/* ── DESKTOP: accordion horizontal ── */}
            <div
              className="hidden md:flex gap-3 w-full"
              style={
                {
                  "--card-open": "480px",
                  "--card-closed": "72px",
                } as React.CSSProperties
              }
            >
              {/* {filtered.map((activity) => (
                <DesktopCardActivity
                  key={activity.id}
                  opt={activity}
                  isActive={activeDesktop === activity.id}
                  onClick={() => setActiveDesktop(activity.id)}
                  onOpenGallery={() => setGalleryActivity(activity)}
                  locale={locale}
                />
              ))} */}
              {filtered.map((activity) => (
                <DesktopCardActivity
                  key={activity.id}
                  opt={{
                    ...activity,
                    href: `/${locale}/${basePath}/${regionSlug}/${country.slug}/${city.slug}/${activity.slug}`,
                  }}
                  isActive={activeDesktop === activity.id}
                  onClick={() => setActiveDesktop(activity.id)}
                  onOpenGallery={() => setGalleryActivity(activity)}
                  locale={locale}
                />
              ))}
            </div>

            {/* ── MOBILE: accordion vertical ── */}
            <div className="flex md:hidden flex-col gap-3">
              {filtered.map((activity) => (
                <MobileCardActivity
                  key={activity.id}
                  opt={{
                    ...activity,
                    href: `/${locale}/${basePath}/${regionSlug}/${country.slug}/${city.slug}/${activity.slug}`,
                  }}
                  isActive={activeDesktop === activity.id}
                  onClick={() => setActiveDesktop(activity.id)}
                  onOpenGallery={() => setGalleryActivity(activity)}
                  locale={locale}
                />
              ))}
            </div>
          </>
        )}

        {/* ── PACKAGES ── */}
        {cityPackages.length > 0 && (
          <div className="mt-16">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent)]/40" />
                <h2 className="text-2xl font-bold uppercase tracking-widest text-theme-tittles">
                  {t(locale, "Paquetes Disponibles", "Available Packages")}
                </h2>
              </div>
              <p className="text-[var(--accent)] text-xs tracking-widest uppercase ml-7">
                {t(
                  locale,
                  `Paquetes que incluyen ${city.name}`,
                  `Packages that include ${city.name}`,
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityPackages.map((pkg) => (
                <article
                  key={pkg.id}
                  className="glass-card border border-white/10 rounded-sm overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 group h-full flex flex-col"
                >
                  <div className="absolute inset-0 opacity-90 pointer-events-none">
                    <CardParticlesCanvas />
                  </div>

                  {/* Image */}
                  <div className="relative h-56 overflow-hidden flex-shrink-0">
                    <CardsSlideShow
                      images={pkg.home_carousel_images || []}
                      interval={4000}
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="text-[var(--accent)] text-[10px] tracking-[0.25em] uppercase font-semibold border border-white/40 px-2 py-0.5 rounded-sm bg-black/40 backdrop-blur-sm">
                        {pkg.internal_pkg_id ?? "VS-00000"}
                      </span>
                    </div>

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
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <SplitText
                      text={pkg.name}
                      className="font-bold text-lg uppercase leading-tight mb-2 text-[var(--accent)]"
                      delay={25}
                      duration={0.5}
                      splitType="chars"
                      from={{ opacity: 0, y: 20 }}
                      to={{ opacity: 1, y: 0 }}
                      textAlign="left"
                    />

                    {pkg.description && (
                      <p className="text-[var(--text)]/80 text-sm leading-relaxed line-clamp-3 mb-4">
                        {pkg.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      {pkg.days && (
                        <div className="flex items-center gap-1.5 text-[var(--text)]/80 text-xs">
                          <FaSun className="text-[var(--accent)]" />
                          <span>
                            <strong className="text-[var(--text)]">
                              {pkg.days}
                            </strong>{" "}
                            {t(locale, "días", "days")}
                          </span>
                        </div>
                      )}
                      {pkg.days && pkg.nights && (
                        <span className="text-[var(--accent)]/70">|</span>
                      )}
                      {pkg.nights && (
                        <div className="flex items-center gap-1.5 text-[var(--text)]/80 text-xs">
                          <FaMoon className="text-[var(--accent)]" />
                          <span>
                            <strong className="text-[var(--text)]">
                              {pkg.nights}
                            </strong>{" "}
                            {t(locale, "noches", "nights")}
                          </span>
                        </div>
                      )}
                      {pkg.includes_flight && (
                        <>
                          <span className="text-[var(--accent)]/70">|</span>
                          <div className="flex items-center gap-1.5 text-white/70 text-xs">
                            <FaPlane className="text-[var(--accent)]" />
                            <strong className="text-[var(--text)]">
                              {t(locale, "Vuelo inc.", "Flight inc.")}
                            </strong>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="border-t border-theme opacity-45 mb-4" />

                    {pkg.region &&
                      (() => {
                        const IconComponent =
                          iconMap[pkg.region.icon ?? ""] || MdTravelExplore;
                        return (
                          <div className="flex items-center gap-2 text-[12px] mb-3">
                            <IconComponent className="text-[var(--accent)]" />
                            <span className="uppercase tracking-[0.25em] text-theme font-bold">
                              {pkg.region.name}
                            </span>
                          </div>
                        );
                      })()}

                    {pkg.visited_cities?.length > 0 && (
                      <div className="flex flex-col gap-1 text-xs text-[var(--accent)] mb-4">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="flex-shrink-0 text-[var(--accent)]" />
                          <p className="text-theme text-[12px] uppercase tracking-wide">
                            {t(locale, "Ciudades visitadas", "Visited Cities")}
                          </p>
                        </div>
                        <div className="ml-6 flex flex-wrap gap-2 text-theme text-[12px]">
                          {pkg.visited_cities.map((c) => (
                            <span key={c.id}>- {c.name}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <ButtonArrow
                      type="button"
                      href={`/${locale === "es" ? "es/paquetes" : "en/packages"}/${pkg.slug}`}
                      title={t(locale, "Ver paquete", "View package")}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Go back */}
        <ButtonArrow
          href={`/${locale}/${basePath}/${regionSlug}/${country.slug}`}
          className="mx-auto mt-12 mb-20 animate-pulse"
          title={t(
            locale,
            `Regresar a más ciudades de ${countryName}`,
            `Return to more cities in ${countryName}`,
          )}
        />
      </div>
    </section>
  );
}
