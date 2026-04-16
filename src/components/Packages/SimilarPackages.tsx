"use client";

import { useRouter } from "next/navigation";
import {
  FaPlane,
  FaMoon,
  FaSun,
  FaMapMarkerAlt,
  FaGlobe,
  FaGlobeEurope,
  FaGlobeAmericas,
  FaGlobeAsia,
  FaGlobeAfrica,
} from "react-icons/fa";
import { GiEarthAmerica, GiPalmTree, GiAztecCalendarSun } from "react-icons/gi";
import { MdTravelExplore } from "react-icons/md";
import type { Package } from "@/types/packages";
import CardsSlideShow from "@/components/CardsSlideShow";
import ButtonArrow from "@/components/ui/ButtonArrow";
import CardParticlesCanvas from "@/components/ui/Particles/CardParticlesCanvas";

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

type Locale = "es" | "en";
const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

interface Props {
  packages: Package[];
  locale: Locale;
}

export default function SimilarPackages({ packages = [], locale }: Props) {
  const router = useRouter();

  if (!packages.length) return null;

  return (
    <>
      <div className="border-t border-theme opacity-45 mt-8" />
      <div className="py-10">
        {/* Eyebrow heading */}
        <div className="flex items-center gap-2 mb-6 px-1">
          <span className="text-[var(--accent)] text-[10px] tracking-[0.3em] uppercase font-semibold">
            {t(locale, "Paquetes similares", "Similar packages")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const href = `/${locale}/${locale === "es" ? "paquetes" : "packages"}/${pkg.slug}`;

            return (
              <article
                key={pkg.id}
                className="glass-card border border-white/10 rounded-sm overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 group h-full flex flex-col relative"
              >
                {/* Partículas internas */}
                <div className="absolute inset-0 opacity-90 pointer-events-none">
                  <CardParticlesCanvas />
                </div>

                {/* ── Image slideshow ── */}
                <div className="relative h-56 overflow-hidden flex-shrink-0">
                  {(pkg.home_carousel_images?.length ?? 0) > 0 ? (
                    <CardsSlideShow
                      images={pkg.home_carousel_images}
                      interval={4000}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <MdTravelExplore className="text-white/20 text-4xl" />
                    </div>
                  )}

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Internal ID badge */}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="text-[var(--accent)] text-[10px] tracking-[0.25em] uppercase font-semibold border border-white/40 px-2 py-0.5 rounded-sm bg-black/40 backdrop-blur-sm">
                      {pkg.internal_pkg_id ?? "VS-00000"}
                    </span>
                  </div>

                  {/* Price card */}
                  {pkg.price_from && (
                    <div className="absolute bottom-3 left-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-sm px-4 py-2 pointer-events-none">
                      <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-0.5">
                        {t(locale, "Desde", "From")}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[var(--accent)] font-bold text-xl">
                          ${Number(pkg.price_from).toLocaleString()}
                        </span>
                        <span className="text-white/50 text-xs">{pkg.currency}</span>
                      </div>
                      {pkg.taxes && (
                        <div className="text-white/40 text-[10px] mt-0.5">
                          + ${Number(pkg.taxes).toLocaleString()}{" "}
                          {t(locale, "impuestos", "taxes")}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Content ── */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Title */}
                  <p className="font-bold text-lg uppercase leading-tight mb-2 text-[var(--accent)]">
                    {pkg.name}
                  </p>

                  {/* Description */}
                  {pkg.description && (
                    <p className="text-[var(--text)]/80 text-sm leading-relaxed line-clamp-3 mb-4">
                      {pkg.description}
                    </p>
                  )}

                  {/* Meta: days / nights / flight */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {pkg.days && (
                      <div className="flex items-center gap-1.5 text-[var(--text)]/80 text-xs">
                        <FaSun className="text-[var(--accent)]" />
                        <span>
                          <strong className="text-[var(--text)]">{pkg.days}</strong>{" "}
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
                          <strong className="text-[var(--text)]">{pkg.nights}</strong>{" "}
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

                  {/* Separator */}
                  <div className="border-t border-theme opacity-45 mb-4" />

                  {/* Region */}
                  {pkg.region && (() => {
                    const IconComponent = iconMap[pkg.region.icon ?? ""] || MdTravelExplore;
                    return (
                      <div className="flex items-center gap-2 text-[12px] mb-2">
                        <IconComponent className="text-[var(--accent)]" />
                        <span className="uppercase tracking-[0.25em] text-theme font-bold">
                          {pkg.region.name}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Countries + Cities */}
                  <div className="space-y-2 mb-5">
                    {pkg.visited_countries?.length > 0 && (
                      <div className="flex flex-col gap-1 text-xs text-[var(--accent)]">
                        <div className="flex items-center gap-2">
                          <FaGlobe className="flex-shrink-0" />
                          <p className="text-theme text-[12px] uppercase tracking-wide">
                            {pkg.visited_countries.length === 1
                              ? t(locale, "País visitado", "Visited Country")
                              : t(locale, "Países visitados", "Visited Countries")}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3 ml-6">
                          {pkg.visited_countries.map((c) => (
                            <span
                              key={c.id}
                              className="flex items-center gap-1 text-theme text-[12px] whitespace-nowrap"
                            >
                              -{" "}
                              <span>{c.name}</span>
                              {c.country_code && (
                                <span
                                  className={`fi fi-${c.country_code.toLowerCase()} w-4 h-3 shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]`}
                                />
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {pkg.visited_cities?.length > 0 && (
                      <div className="flex flex-col gap-1 text-xs text-[var(--accent)]">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="flex-shrink-0 text-[var(--accent)]" />
                          <p className="text-theme text-[12px] uppercase tracking-wide">
                            {pkg.visited_cities.length === 1
                              ? t(locale, "Ciudad visitada", "Visited City")
                              : t(locale, "Ciudades visitadas", "Visited Cities")}
                          </p>
                        </div>
                        <div className="ml-6 flex flex-wrap gap-2 text-theme text-[12px]">
                          {pkg.visited_cities.map((c) => (
                            <span key={c.id}>- {c.name}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Separator */}
                  <div className="border-t border-theme opacity-45 mb-4 mt-auto" />

                  {/* CTA */}
                  <ButtonArrow
                    type="button"
                    href={href}
                    title={t(locale, "Ver paquete", "View package")}
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