"use client";

import {
  FaMoon,
  FaPlane,
  FaMapMarkerAlt,
  FaUsers,
  
  FaSun,
} from "react-icons/fa";

import type { PackageDetail, Supplement } from "@/types/packages";
import QuoteForm from "./QuoteForm";
import { SuccessScreen } from "./Details/SuccessScreen";

type Locale = "es" | "en";
const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

interface Props {
  pkg: PackageDetail;
  locale: Locale;
}

function PriceRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: number | null | undefined;
  muted?: boolean;
}) {
  if (value == null || value === 0) return null;
  return (
    <div className="flex justify-between items-baseline py-[5px] border-b border-[var(--border)]/30 last:border-b-0">
      <span className="text-[var(--text)]/50 text-xs">{label}</span>
      <span
        className={
          muted
            ? "text-[var(--text)]/60 font-medium text-xs"
            : "text-[var(--accent)] font-bold text-sm"
        }
      >
        {muted && "+ "}${value.toLocaleString()}
      </span>
    </div>
  );
}

const sectionLabel =
  "text-[var(--text)]/30 text-[10px] uppercase tracking-widest mb-3";

export default function PricePanel({ pkg, locale }: Props) {
  const tarifasNote = pkg.notes?.find((n) => n.type === "tarifas");
  const supplements = pkg.supplements ?? [];

  return (
    <div className="flex flex-col-reverse lg:flex-row lg:gap-2 border border-[var(--border)]/40 rounded-sm overflow-hidden mt-8">
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
      <div className="w-full lg:w-1/3 backdrop-blur-md space-y-12 ">
        {/* Header */}
        <div className="bg-white/5 border-b border-[var(--border)]/40 px-6 py-5">
          <h3 className="text-[var(--accent)] font-bold text-lg uppercase tracking-wider leading-tight">
            {pkg.name}
          </h3>
          <p className="text-[var(--accent)]/40 text-xs mt-1 tracking-widest uppercase">
            {pkg.internal_pkg_id ?? "VS-00000"}
          </p>
        </div>

        {/* ── Precios por persona ── */}
        <div className="px-6 py-4 border-b border-[var(--border)]/40">
          <p className={sectionLabel}>
            {t(locale, "Precio por persona", "Price per person")}
          </p>
          <PriceRow
            label={t(locale, "Hab. doble", "Double room")}
            value={pkg.price_from}
          />
          <PriceRow
            label={t(locale, "Hab. sencilla", "Single room")}
            value={pkg.price_single}
          />
          <PriceRow
            label={t(locale, "Hab. triple", "Triple room")}
            value={pkg.price_triple}
          />
          <PriceRow
            label={t(locale, "Menor (2–11 años)", "Child (2–11 yrs)")}
            value={pkg.price_child}
          />
          <PriceRow
            label={t(locale, "Infante (<2 años)", "Infant (<2 yrs)")}
            value={pkg.price_infant}
            muted
          />
          <PriceRow
            label={t(locale, "Impuestos aéreos", "Air taxes")}
            value={pkg.taxes}
            muted
          />
        </div>

        {/* ── Vigencia y depósito ── */}
        {/* {(pkg.prices_valid_until || pkg.deposit_amount) && (
          <div className="px-6 py-4 border-b border-[var(--border)]/40 space-y-3">
            {pkg.prices_valid_until && (
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full px-3 py-1 text-xs">
                <FaClock className="text-[50px]" />
                {t(locale, "Vigente hasta", "Valid until")}{" "}
                {new Date(pkg.prices_valid_until).toLocaleDateString(
                  locale === "es" ? "es-MX" : "en-US",
                  { day: "numeric", month: "short", year: "numeric" },
                )}
              </div>
            )}
            {pkg.deposit_amount && (
              <div className="flex justify-between items-baseline py-[5px]">
                <span className="text-[var(--text)]/50 text-xs">
                  {t(locale, "Depósito para reservar", "Deposit to book")}
                </span>
                <span className="text-[var(--text)]/60 font-medium text-xs">
                  ${Number(pkg.deposit_amount).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )} */}

        {/* ── Suplementos ── */}
        {supplements.length > 0 && (
          <div className="px-6 py-4 border-b border-[var(--border)]/40">
            <p className={sectionLabel}>
              {t(
                locale,
                "Suplementos por fecha de salida",
                "Departure date supplements",
              )}
            </p>
            <div className="space-y-3">
              {supplements.map((sup: Supplement, i: number) => {
                const byMonth: Record<string, number[]> = {};
                sup.dates.forEach((d) => {
                  const dt = new Date(d + "T00:00:00");
                  const key = dt.toLocaleDateString(
                    locale === "es" ? "es-MX" : "en-US",
                    { month: "long", year: "numeric" },
                  );
                  if (!byMonth[key]) byMonth[key] = [];
                  byMonth[key].push(dt.getDate());
                });
                return (
                  <div
                    key={i}
                    className="bg-[var(--accent)]/4 border border-[var(--border)]/40 rounded-sm px-5 py-4 hover:border-[var(--accent)]/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        {Object.entries(byMonth).map(([month, days]) => (
                          <p
                            key={month}
                            className="text-xs text-[var(--text)]/50 leading-relaxed capitalize"
                          >
                            <span className="text-[var(--text)]/70 font-medium">
                              {month}:
                            </span>{" "}
                            {days.sort((a, b) => a - b).join(", ")}
                          </p>
                        ))}
                      </div>
                      <div className="shrink-0 flex flex-col items-end">
                        <span className="text-[var(--text)]/30 text-[10px] uppercase tracking-widest mb-0.5">
                          {t(locale, "suplemento", "supplement")}
                        </span>
                        <span className="text-[var(--accent)] font-bold text-sm">
                          +${sup.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[var(--text)]/30 text-[10px] mt-3 leading-relaxed">
              {t(
                locale,
                "* El suplemento se suma al precio base según la fecha de salida elegida.",
                "* Supplement is added to the base price based on the selected departure date.",
              )}
            </p>
          </div>
        )}

        {/* ── Detalles del viaje ── */}
        <div className="px-6 py-4 border-b border-[var(--border)]/40 space-y-2.5">
          <p className={sectionLabel}>
            {t(locale, "Detalles del viaje", "Trip details")}
          </p>
          {pkg.departure_city && (
            <div className="flex items-center gap-2.5 text-xs text-[var(--text)]/50">
              <FaMapMarkerAlt className="text-[var(--accent)] flex-shrink-0" />
              {t(locale, "Salida desde", "Departure from")} {pkg.departure_city}
            </div>
          )}
          {pkg.days && (
            <div className="flex items-center gap-2.5 text-xs text-[var(--text)]/50">
              <FaSun className="text-[var(--accent)] flex-shrink-0" />
              <span>
                <strong className="text-[var(--text)]/80">{pkg.days}</strong>{" "}
                {t(locale, "días", "days")}
              </span>
            </div>
          )}
          {pkg.nights && (
            <div className="flex items-center gap-2.5 text-xs text-[var(--text)]/50">
              <FaMoon className="text-[var(--accent)] flex-shrink-0" />
              <span>
                <strong className="text-[var(--text)]/80">{pkg.nights}</strong>{" "}
                {t(locale, "noches", "nights")}
              </span>
            </div>
          )}
          {pkg.includes_flight && (
            <div className="flex items-center gap-2.5 text-xs text-[var(--text)]/50">
              <FaPlane className="text-[var(--accent)] flex-shrink-0" />
              {t(locale, "Vuelo incluido", "Flight included")}
            </div>
          )}
          {pkg.min_passengers && (
            <div className="flex items-center gap-2.5 text-xs text-[var(--text)]/50">
              <FaUsers className="text-[var(--accent)] flex-shrink-0" />
              {t(locale, "Mínimo", "Minimum")} {pkg.min_passengers}{" "}
              {t(locale, "pasajeros", "passengers")}
            </div>
          )}
        </div>

        {/* ── Nota de tarifas ── */}
        {tarifasNote && (
          <div className="px-6 py-4">
            <p className={sectionLabel}>{tarifasNote.title}</p>
            <div className="border-l-2 border-[var(--accent)]/30 pl-3">
              <p className="text-[var(--text)]/40 text-[11px] leading-relaxed whitespace-pre-line">
                {tarifasNote.content}
              </p>
            </div>
          </div>
        )}
      </div>
       
    </div>
  );
}
