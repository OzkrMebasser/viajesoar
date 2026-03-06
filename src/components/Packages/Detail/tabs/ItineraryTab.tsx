import { useState } from "react";
import { FaCheck, FaTimes, FaChevronDown } from "react-icons/fa";
import { MdTravelExplore } from "react-icons/md";
import type { DayItinerary } from "@/types/packages";
import RouteIcon from "@/icons/RouteIcon";
import Image from "next/image";
type Locale = "es" | "en";
const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

interface Props {
  itinerary: DayItinerary[];
  included: string[];
  notIncluded: string[];
  locale: Locale;
}

export default function ItineraryTab({
  itinerary,
  included,
  notIncluded,
  locale,
}: Props) {
  const [openDay, setOpenDay] = useState<number | null>(1);

  return (
    <div>
      <h2 className="text-2xl sm:text-4xl font-bold text-theme-tittles uppercase mb-2">
        {t(locale, "Itinerario", "Itinerary")}
      </h2>
      <p className="text-[var(--text)]/80 text-sm mb-8">
        {t(
          locale,
          "Programa sujeto a cambios según fecha de salida.",
          "Program subject to change based on departure date.",
        )}
      </p>

      {itinerary.length > 0 ? (
        <div className="relative">
          {/*Dias linea vertical*/}
          <div className="absolute left-[22px] top-14 bottom-2 w-[1px] bg-[var(--accent)]/40 " />
          <div className="flex grid-cols-2  text-theme  text-center uppercase text-lg font-bold mb-3 tracking-wider ">
            <span className="  p-2 text-center w-3/20 lg:w-1/20">
              {t(locale, "Día", "Day")}
            </span>
            <span className="p-2 w-17/20 items-center gap-2 text-theme ">
              {t(locale, "Recorrido", "Route")}
              <RouteIcon className="h-[18px] mb-1 w-6 inline ml-1" />
            </span>{" "}
          </div>
          {itinerary.map((day) => (
            <div key={day.day} className="relative pl-14 mb-3">
              {/* Day number dot */}
              <div
                className={`absolute left-0 top-0 w-[46px] h-[46px] rounded-sm flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  openDay === day.day
                    ? "bg-[var(--accent)] text-theme-btn"
                    : "bg-gradient-theme border border-[var(--accent)]/40 text-[var(--accent)]"
                }`}
              >
                {String(day.day).padStart(2, "0")}
              </div>

              {/* Card */}
              <div
                className={`bg-white/5 border rounded-sm overflow-hidden transition-all duration-300 ${
                  openDay === day.day
                    ? "border-[var(--accent)]/30"
                    : "border-[var(--border)]/40"
                }`}
              >
                <button
                  onClick={() =>
                    setOpenDay(openDay === day.day ? null : day.day)
                  }
                  className="w-full flex items-center justify-between px-5 py-[12.5px] text-left"
                >
                  <span
                    className={`font-semibold text-sm transition-colors ${
                      openDay === day.day
                        ? "text-[var(--accent)]"
                        : "text-theme-tittles"
                    }`}
                  >
                    {day.title}
                  </span>
                  <FaChevronDown
                    className={`text-[var(--text)] text-xs transition-transform duration-300 flex-shrink-0 ml-4 ${
                      openDay === day.day ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDay === day.day && (
                  <div className="px-5 pb-5 border-t border-[var(--border)]/40">
                    <p className="text-[var(--text)]/80 text-sm leading-relaxed mt-4">
                      {day.description}
                    </p>
                    {day.optional && (
                      <div className="mt-4 bg-[var(--accent)]/10 border-l-2 border-[var(--border)]/40 px-4 py-3 rounded-sm">
                        <p className="text-[var(--accent)] text-[10px] tracking-[0.2em] uppercase font-semibold mb-1">
                          ✦{" "}
                          {t(
                            locale,
                            "Excursión opcional",
                            "Optional excursion",
                          )}
                        </p>
                        <p className="text-theme text-sm">{day.optional}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5 border border-[var(--border)]/40 rounded-sm p-8 text-center">
          <MdTravelExplore className="text-[var(--text)]/60 text-4xl mx-auto mb-3" />
          <p className="text-[var(--text)]/60 text-sm">
            {t(locale, "Itinerario próximamente", "Itinerary coming soon")}
          </p>
        </div>
      )}

      {/* Includes / Not Includes */}
      {(included.length > 0 || notIncluded.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
          {included.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-theme uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaCheck className="text-emerald-400 text-sm" />
                {t(locale, "Incluye", "Includes")}
              </h3>
              <ul className="space-y-3">
                {included.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm text-[var(--text)]/80 border-b border-[var(--border)]/40 pb-3 last:border-0"
                  >
                    <FaCheck className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {notIncluded.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-theme uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaTimes className="text-red-400 text-sm" />
                {t(locale, "No incluye", "Not included")}
              </h3>
              <ul className="space-y-3">
                {notIncluded.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm text-[var(--text)]/80 border-b border-[var(--border)]/40 pb-3 last:border-0"
                  >
                    <FaTimes className="text-red-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
