"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Locale } from "@/types/locale";
import type { Offer } from "@/types/offers";
import { MdTravelExplore } from "react-icons/md";
import {
  FaSearch, FaTimes, FaTag, FaClock, FaMapMarkerAlt, FaSun,
} from "react-icons/fa";
import SplitText from "@/components/SplitText";
import ParticlesCanvas from "@/components/ui/Particles/ParticlesCanvas";
import CardParticlesCanvas from "@/components/ui/Particles/CardParticlesCanvas";
import ButtonArrow from "@/components/ui/ButtonArrow";

interface Props {
  locale: Locale;
  offers: Offer[];
}

const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Colores de badge según etiqueta
const badgeStyle = (label: string | null) => {
  const l = (label ?? "").toLowerCase();
  if (l.includes("last") || l.includes("minute")) return "bg-red-500/20 text-red-300 border-red-500/30";
  if (l.includes("exclus")) return "bg-purple-500/20 text-purple-300 border-purple-500/30";
  if (l.includes("black")) return "bg-gray-900/60 text-white border-white/20";
  return "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30";
};

function CountdownBadge({ until, locale }: { until: string | null; locale: Locale }) {
  if (!until) return null;
  const diff = new Date(until).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return (
    <div className="flex items-center gap-1 text-[10px] text-white/50 mt-1">
      <FaClock className="text-[8px]" />
      <span>
        {t(locale, "Válida", "Valid")} {days} {t(locale, "días más", "more days")}
      </span>
    </div>
  );
}

export default function OffersPage({ locale, offers }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "featured">("all");

  const filtered = useMemo(() => {
    let list = filter === "featured" ? offers.filter((o) => o.is_featured) : offers;
    if (!query.trim()) return list;
    const q = normalize(query);
    return list.filter(
      (o) =>
        normalize(o.title).includes(q) ||
        normalize(o.destination_label ?? "").includes(q) ||
        normalize(o.subtitle ?? "").includes(q),
    );
  }, [query, offers, filter]);

  const heroOffer = offers.find((o) => o.is_featured) ?? offers[0];

  return (
    <div className="min-h-screen bg-gradient-theme">

      {/* ── HERO ── */}
      <section className="relative h-[75vh] flex flex-col justify-end overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          {heroOffer?.cover_image ? (
            <img
              src={heroOffer.cover_image}
              alt="hero"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20 pt-10">
          {/* Eyebrow */}
          <span className="text-[var(--accent)] text-[10px] tracking-[0.35em] uppercase font-semibold mb-3 block">
            {t(locale, "Promociones exclusivas", "Exclusive promotions")}
          </span>

          <SplitText
            text={t(locale, "Ofertas", "Travel")}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold uppercase mb-1"
            delay={20}
            duration={0.5}
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="left"
          />
          <SplitText
            text={t(locale, "Imperdibles", "Deals")}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold uppercase mb-4 text-[var(--accent)]"
            delay={20}
            duration={0.5}
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="left"
          />

          <p className="text-white/70 text-sm sm:text-base max-w-md [text-shadow:1px_1px_3px_#000]">
            {t(
              locale,
              `${offers.length} ofertas disponibles. Precios limitados por tiempo.`,
              `${offers.length} deals available. Limited-time prices.`,
            )}
          </p>
        </div>
      </section>

      {/* ── FILTERS + SEARCH ── */}
      <div className="bg-gradient-theme py-5 sticky top-0 z-30 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative max-w-md w-full">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] text-sm pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(locale, "Buscar por destino o nombre...", "Search by destination or name...")}
              className="w-full text-[var(--accent)] border border-[var(--accent)] focus:border-[var(--accent)]/60 rounded-sm pl-10 pr-10 py-2.5 text-sm outline-none transition-colors duration-200 bg-transparent"
            />
            {query && (
              <button
                title="Close Search input"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--accent)] hover:text-white/60 transition-colors"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2">
            {(["all", "featured"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-sm border transition-all duration-200 cursor-pointer ${
                  filter === f
                    ? "bg-[var(--accent)] text-black border-[var(--accent)] font-bold"
                    : "border-white/20 text-white/50 hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
                }`}
              >
                {f === "all"
                  ? t(locale, "Todas", "All")
                  : t(locale, "Destacadas", "Featured")}
              </button>
            ))}
          </div>
        </div>

        {query && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-2">
            <p className="text-[var(--accent)] text-xs tracking-widest uppercase">
              {filtered.length} {t(locale, "resultado(s)", "result(s)")}
            </p>
          </div>
        )}
      </div>

      {/* ── GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative">
        <ParticlesCanvas />

        {filtered.length === 0 ? (
          <div className="min-h-[30vh] flex flex-col items-center justify-center gap-4">
            <MdTravelExplore className="text-white/20 text-6xl" />
            <p className="text-white/30 text-sm tracking-widest uppercase">
              {t(locale, "No se encontraron ofertas", "No offers found")}
            </p>
            <ButtonArrow
              title={t(locale, "Limpiar búsqueda", "Clear search")}
              onClick={() => setQuery("")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((offer) => {
              // Determina la URL destino
              const href = offer.package?.slug
                ? `/${locale}/${locale === "es" ? "paquetes" : "packages"}/${offer.package.slug}`
                : null;

              const card = (
                <article
                  key={offer.id}
                  className="glass-card border border-white/10 rounded-sm overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-300 group h-full flex flex-col relative"
                >
                  {/* Partículas */}
                  <div className="absolute inset-0 opacity-90 pointer-events-none">
                    <CardParticlesCanvas />
                  </div>

                  {/* ── Imagen ── */}
                  <div className="relative h-56 overflow-hidden flex-shrink-0">
                    {offer.cover_image ? (
                      <img
                        src={offer.cover_image}
                        alt={offer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <MdTravelExplore className="text-white/20 text-4xl" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />

                    {/* Badge etiqueta */}
                    {offer.badge_label && (
                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] tracking-[0.25em] uppercase font-bold border px-2 py-0.5 rounded-sm backdrop-blur-sm ${badgeStyle(offer.badge_label)}`}>
                          {offer.badge_label}
                        </span>
                      </div>
                    )}

                    {/* Descuento badge */}
                    {offer.discount_percent && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                        -{offer.discount_percent}%
                      </div>
                    )}

                    {/* Precio */}
                    <div className="absolute bottom-3 left-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-sm px-4 py-2 pointer-events-none">
                      <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-0.5">
                        {t(locale, "Desde", "From")}
                      </p>
                      <div className="flex items-baseline gap-2">
                        {offer.original_price && (
                          <span className="text-white/30 text-xs line-through">
                            ${Number(offer.original_price).toLocaleString()}
                          </span>
                        )}
                        <span className="text-[var(--accent)] font-bold text-xl">
                          ${Number(offer.offer_price ?? offer.original_price).toLocaleString()}
                        </span>
                        <span className="text-white/50 text-xs">{offer.currency}</span>
                      </div>
                    </div>
                  </div>

                  {/* ── Contenido ── */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="font-bold text-lg uppercase leading-tight mb-1 text-[var(--accent)]">
                      {offer.title}
                    </p>

                    {offer.subtitle && (
                      <p className="text-white/50 text-xs tracking-widest uppercase mb-3">
                        {offer.subtitle}
                      </p>
                    )}

                    {offer.description && (
                      <p className="text-[var(--text)]/80 text-sm leading-relaxed line-clamp-3 mb-4">
                        {offer.description}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap gap-3 mb-3 text-xs text-white/60">
                      {offer.destination_label && (
                        <div className="flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-[var(--accent)] text-[10px]" />
                          <span>{offer.destination_label}</span>
                        </div>
                      )}
                      {offer.duration_label && (
                        <div className="flex items-center gap-1.5">
                          <FaSun className="text-[var(--accent)] text-[10px]" />
                          <span>{offer.duration_label}</span>
                        </div>
                      )}
                    </div>

                    <CountdownBadge until={offer.valid_until} locale={locale} />

                    <div className="border-t border-theme opacity-45 my-4 mt-auto" />

                    {href ? (
                      <ButtonArrow
                        href={href}
                        title={t(locale, "Ver paquete", "View package")}
                      />
                    ) : (
                      <p className="text-white/20 text-xs tracking-widest uppercase">
                        {t(locale, "Consultar disponibilidad", "Check availability")}
                      </p>
                    )}
                  </div>
                </article>
              );

              return href ? (
                <Link key={offer.id} href={href} className="h-full">
                  {card}
                </Link>
              ) : (
                <div key={offer.id} className="h-full">
                  {card}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}