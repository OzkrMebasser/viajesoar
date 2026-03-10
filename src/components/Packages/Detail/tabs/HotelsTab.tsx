// import { FaHotel } from "react-icons/fa";
import { FaHotel } from "react-icons/fa6";

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
        <div className="overflow-x-auto rounded-sm border border-[var(--border)]/40  ">
          {" "}
          <table className="w-full ">
            <thead>
              <tr className="border-b border-[var(--border)]/40 bg-(--accent)/20 ">
                <th className="px-2 lg:px-5 py-3 text-center text-theme uppercase font-semibold text-sm transition-colors border-r border-[var(--border)]/40">
                  {t(locale, "País", "Country")}
                </th>

                <th className="px-2 lg:px-5 py-3 text-center text-theme uppercase font-semibold text-sm transition-colors border-r border-[var(--border)]/40">
                  {t(locale, "Ciudad", "City")}
                </th>

                <th className="px-2 lg:px-5 py-3 text-center text-theme uppercase font-semibold text-sm transition-colors border-r border-[var(--border)]/40">
                  {t(locale, "Hotel", "Hotel")}
                </th>

                <th className="px-2 lg:px-5 py-3 text-center text-theme uppercase font-semibold text-sm transition-colors border-r border-[var(--border)]/40">
                  {t(locale, "Tipo", "Type")}
                </th>
              </tr>
            </thead>

            <tbody>
              {hotels.map((h, i) => {
                const prev = hotels[i - 1];

                const showCountry = !prev || prev.country !== h.country;
                const showCity =
                  !prev || prev.country !== h.country || prev.city !== h.city;

                return (
                  <tr
                    key={i}
                    className="border-b border-[var(--border)]/40 md:hover:bg-[var(--accent)]/10 active:bg-[var(--accent)]/20 transition-colors"
                  >
                    <td className="px-2 lg:px-5   py-4 text-sm text-[var(--text)]/80 border-r border-[var(--border)]/30 text-center">
                      {showCountry ? h.country : ""}
                    </td>

                    <td className="px-2 lg:px-5 py-4 text-sm text-[var(--text)]/80 border-r border-[var(--border)]/30 text-center">
                      {showCity ? h.city : ""}
                    </td>

                    <td className="px-2 lg:px-5 py-4 text-sm text-[var(--text)]/80 border-r border-[var(--border)]/30 text-left">
                      <div className="flex items-start gap-2">
                        <FaHotel className="text-[var(--accent)] text-xs mt-1 flex-shrink-0" />
                        <span>
                          {h.hotels.join(" / ")}{" "}
                          {t(locale, "O Similar", "Or Similar")}
                        </span>
                      </div>
                    </td>

                    <td className="px-2 lg:px-5 py-4 text-sm text-[var(--text)]/80 text-center">
                      {h.type}
                    </td>
                  </tr>
                );
              })}
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