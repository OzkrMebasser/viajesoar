import { FaHotel } from "react-icons/fa";
import type { HotelEntry } from "@/types/packages";

type Locale = "es" | "en";
const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

interface Props {
  hotels: HotelEntry[];
  locale: Locale;
}

export default function HotelsTab({ hotels, locale }: Props) {
  return (
    <div>
      <h2 className="text-2xl sm:text-4xl font-bold text-theme-tittles uppercase mb-2">
        {t(locale, "Hoteles Previstos", "Planned Hotels")}
      </h2>
      <p className="text-[var(--text)]/80 text-sm mb-8">
        {t(
          locale,
          "Sujetos a cambio por establecimientos similares.",
          "Subject to change for similar establishments.",
        )}
      </p>

      {hotels.length > 0 ? (
        <div className="overflow-hidden rounded-sm border border-[var(--border)]/40">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]/40 bg-white/5">
                <th className="text-left px-5 py-3 text-[10px] tracking-[0.2em] uppercase text-[var(--accent)] font-semibold">
                  {t(locale, "País", "Country")}
                </th>
                <th className="text-left px-5 py-3 text-[10px] tracking-[0.2em] uppercase text-[var(--accent)] font-semibold">
                  {t(locale, "Ciudad", "City")}
                </th>
                <th className="text-left px-5 py-3 text-[10px] tracking-[0.2em] uppercase text-[var(--accent)] font-semibold">
                  {t(locale, "Hotel", "Hotel")}
                </th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((h, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--border)]/40 last:border-0 hover:bg-white/5 transition-colors"
                >
                  <td className="px-5 py-4 text-sm text-white/60">{h.country}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-white">{h.city}</td>
                  <td className="px-5 py-4 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <FaHotel className="text-[var(--accent)] flex-shrink-0 text-xs" />
                      {h.hotel}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-8 text-center">
          <FaHotel className="text-[var(--text)]/60 text-3xl mx-auto mb-3" />
          <p className="text-[var(--text)]/60 text-sm">
            {t(locale, "Hoteles próximamente", "Hotels coming soon")}
          </p>
        </div>
      )}
    </div>
  );
}