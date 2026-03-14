"use client";

import { useState } from "react";
import { FaMoon, FaPlane, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import ButtonGlower from "@/components/ui/ButtonGlower";
import QuoteForm from "./QuoteForm";
import type { PackageDetail } from "@/types/packages";

type Locale = "es" | "en";
const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

type QuotePkg = Pick<
  PackageDetail,
  | "name"
  | "slug"
  | "internal_pkg_id"
  | "price_from"
  | "price_single"
  | "taxes"
  | "duration"
  | "includes_flight"
  | "airlines"
  | "departure_city"
>;

interface Props {
  pkg: QuotePkg;
  locale: Locale;
}

export default function PackageQuote({ pkg, locale }: Props) {
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-0 border border-[var(--border)]/40 rounded-sm overflow-hidden">
      
      {/* ── FORM — 2/3 en lg ── */}
      <div className="w-full lg:w-2/3 border-t lg:border-t-0 lg:border-r border-[var(--border)]/40">
        <QuoteForm
          locale={locale}
          packageName={pkg.name}
          internalPkgId={pkg.internal_pkg_id}
          packageSlug={pkg.slug}
          priceFrom={pkg.price_from}
          priceSingle={pkg.price_single}
        />
      </div>

      {/* ── PRICE PANEL — 1/3 en lg ── */}
      <div className="w-full lg:w-1/3 backdrop-blur-md">
        {/* Header */}
        <div className="bg-white/5 border-b border-[var(--border)]/40 px-6 py-5">
          <h3 className="text-[var(--accent)] font-bold text-lg uppercase tracking-wider leading-tight">
            {pkg.name}
          </h3>
          <p className="text-[var(--accent)]/40 text-xs mt-1 tracking-widest uppercase">
            {pkg.internal_pkg_id ?? "VS-00000"}
          </p>
        </div>

        {/* Price rows */}
        <div className="px-6 py-4 space-y-3">
          <div className="flex justify-between items-baseline py-2 border-b border-[var(--border)]/40">
            <span className="text-[var(--text)]/50 text-sm">
              {t(locale, "Hab. Doble", "Double room")}
            </span>
            <span className="text-[var(--accent)] font-bold text-lg">
              ${Number(pkg.price_from).toLocaleString()}
            </span>
          </div>

          {pkg.price_single && (
            <div className="flex justify-between items-baseline py-2 border-b border-[var(--border)]/40">
              <span className="text-[var(--text)]/50 text-sm">
                {t(locale, "Hab. Sencilla", "Single room")}
              </span>
              <span className="text-[var(--accent)] font-bold text-lg">
                ${Number(pkg.price_single).toLocaleString()}
              </span>
            </div>
          )}

          {pkg.taxes && (
            <div className="flex justify-between items-baseline py-2 border-b border-[var(--border)]/40">
              <span className="text-[var(--text)]/50 text-sm">
                {t(locale, "Impuestos aéreos", "Air taxes")}
              </span>
              <span className="text-[var(--text)]/60 font-semibold text-sm">
                + ${Number(pkg.taxes).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Quick info */}
        <div className="px-6 py-4 border-t border-[var(--border)]/40 space-y-3">
          {pkg.duration && (
            <div className="flex items-center gap-3 text-sm text-[var(--text)]/50">
              <FaMoon className="text-[var(--accent)] flex-shrink-0" />
              {pkg.duration}
            </div>
          )}
          {pkg.includes_flight && (
            <div className="flex items-center gap-3 text-sm text-[var(--text)]/50">
              <FaPlane className="text-[var(--accent)] flex-shrink-0" />
              {t(locale, "Incluye vuelo desde México", "Includes flight from Mexico")}
            </div>
          )}
          {(pkg.airlines ?? []).length > 0 && (
            <div className="flex items-center gap-3 text-sm text-[var(--text)]/50">
              <FaStar className="text-[var(--accent)] flex-shrink-0" />
              {(pkg.airlines ?? []).join(", ")}
            </div>
          )}
          {pkg.departure_city && (
            <div className="flex items-center gap-3 text-sm text-[var(--text)]/50">
              <FaMapMarkerAlt className="text-[var(--accent)] flex-shrink-0" />
              {t(locale, "Salida desde", "Departure from")} {pkg.departure_city}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}