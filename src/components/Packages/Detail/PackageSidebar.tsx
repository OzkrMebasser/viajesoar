import { FaMoon, FaPlane, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import ButtonGlower from "@/components/ui/ButtonGlower";
import type { PackageDetail } from "@/types/packages";

type Locale = "es" | "en";
const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

type SidebarPkg = Pick<
  PackageDetail,
  | "name"
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
  pkg: SidebarPkg;
  locale: Locale;
  onCotizar?: () => void;
}

export default function PackageSidebar({ pkg, locale, onCotizar }: Props) {
  return (
    <div className="mt-12 bg-white/5 backdrop-blur-md border border-[var(--border)]/40 rounded-sm overflow-hidden w-2/5">
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
            <span className="text-white/50 text-sm">
              {t(locale, "Hab. Sencilla", "Single room")}
            </span>
            <span className="text-[var(--accent)] font-bold text-lg">
              ${Number(pkg.price_single).toLocaleString()}
            </span>
          </div>
        )}

        {pkg.taxes && (
          <div className="flex justify-between items-baseline py-2 border-b border-[var(--border)]/40">
            <span className="text-white/50 text-sm">
              {t(locale, "Impuestos aéreos", "Air taxes")}
            </span>
            <span className="text-white/60 font-semibold text-sm">
              + ${Number(pkg.taxes).toLocaleString()}
            </span>
          </div>
        )}

        <div className="pt-3">
          <ButtonGlower onClick={onCotizar} className="w-full justify-center">
            {t(locale, "Cotizar ahora", "Get a quote")}
          </ButtonGlower>
        </div>
      </div>

      {/* Quick info */}
      <div className="px-6 py-4 border-t border-[var(--border)]/40 space-y-3">
        {pkg.duration && (
          <div className="flex items-center gap-3 text-sm text-white/50">
            <FaMoon className="text-[var(--accent)] flex-shrink-0" />
            {pkg.duration}
          </div>
        )}
        {pkg.includes_flight && (
          <div className="flex items-center gap-3 text-sm text-white/50">
            <FaPlane className="text-[var(--accent)] flex-shrink-0" />
            {t(locale, "Incluye vuelo desde México", "Includes flight from Mexico")}
          </div>
        )}
        {(pkg.airlines || []).length > 0 && (
          <div className="flex items-center gap-3 text-sm text-white/50">
            <FaStar className="text-[var(--accent)] flex-shrink-0" />
            {(pkg.airlines || []).join(", ")}
          </div>
        )}
        {pkg.departure_city && (
          <div className="flex items-center gap-3 text-sm text-white/50">
            <FaMapMarkerAlt className="text-[var(--accent)] flex-shrink-0" />
            {t(locale, "Salida desde", "Departure from")} {pkg.departure_city}
          </div>
        )}
      </div>
    </div>
  );
}