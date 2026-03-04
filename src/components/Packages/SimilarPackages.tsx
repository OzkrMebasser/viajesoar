"use client";

import { useRouter } from "next/navigation";
import { FaMoon, FaPlane } from "react-icons/fa";
import type { Package } from "@/types/packages";

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
    <div className="mt-4">
      {/* Header */}
      <h4 className="text-[var(--accent)] text-[10px] tracking-[0.25em] uppercase font-semibold mb-3 px-1">
        {t(locale, "Paquetes similares", "Similar packages")}
      </h4>

      <div className="flex flex-col gap-3">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() =>
              router.push(
                `/${locale}/${locale === "es" ? "paquetes" : "packages"}/${pkg.slug}`
              )
            }
            className="group w-full text-left bg-white/5 border border-[var(--border)]/40 rounded-sm overflow-hidden hover:border-[var(--accent)]/40 transition-all duration-200"
          >
            {/* Image */}
            {pkg.home_carousel_images?.[0] && (
              <div className="relative h-24 overflow-hidden">
                <img
                  src={pkg.home_carousel_images[0]}
                  alt={pkg.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Price badge */}
                {pkg.price_from && (
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-sm">
                    <span className="text-[var(--accent)] font-bold text-xs">
                      ${Number(pkg.price_from).toLocaleString()}
                    </span>
                    <span className="text-white/50 text-[10px] ml-1">
                      {pkg.currency}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Info */}
            <div className="px-4 py-3">
              <p className="text-white text-sm font-semibold leading-tight group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                {pkg.name}
              </p>


              <div className="flex items-center gap-3 mt-2">
                {pkg.nights && (
                  <span className="flex items-center gap-1 text-white/40 text-[11px]">
                    <FaMoon className="text-[var(--accent)] text-[9px]" />
                    {pkg.nights} {t(locale, "noches", "nights")}
                  </span>
                )}
                {pkg.includes_flight && (
                  <span className="flex items-center gap-1 text-white/40 text-[11px]">
                    <FaPlane className="text-[var(--accent)] text-[9px]" />
                    {t(locale, "Vuelo inc.", "Flight inc.")}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}