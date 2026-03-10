"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

import TourMap from "../TourMap";
import SimilarPackages from "@/components/Packages/SimilarPackages";
import ButtonArrow from "@/components/ui/ButtonArrow";

// ── Subcomponents ──
import PackageHero from "./PackageHero";
import PackageSidebar from "./PackageSidebar";
import ItineraryTab from "./tabs/ItineraryTab";
import OptionalsTab from "./tabs/OptionalTab/OptionalsTab";
import HotelsTab from "./tabs/HotelsTab";
import PricesTab from "./tabs/PricesTab";
import PackageNotes from "./PackageNotes";

// ── Types ──
import type {
  TabType,
  DayItinerary,
  HotelEntry,
  PackageDetail,
  Package,
} from "@/types/packages";

import type { OptionalActivity } from "@/types/activities";

type Locale = "es" | "en";
const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

interface Props {
  locale: Locale;
  pkg: PackageDetail;
  similarPackages?: Package[];
  optionals: OptionalActivity[]; // ← agregar esto
}
const TABS: { key: TabType; label: [string, string] }[] = [
  { key: "itinerary", label: ["Itinerario", "Itinerary"] },
  { key: "optionals", label: ["Opcionales", "Optionals"] },
  { key: "hotels", label: ["Hoteles", "Hotels"] },
  { key: "prices", label: ["Tarifas", "Prices"] },
];

export default function PackageInfoFull({
  pkg,
  locale,
  similarPackages = [],
  optionals 
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("itinerary");

  const tabsScrollRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // ── Detect mobile ──
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // ── Scroll detection for tabs ──
  useEffect(() => {
    if (!isMobile) return;

    const el = tabsScrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxScroll = scrollWidth - clientWidth;

      if (scrollLeft >= maxScroll - 5) {
        setIsAtEnd(true);
        setShowScrollIndicator(true);
      } else if (scrollLeft <= 5) {
        setIsAtEnd(false);
        setShowScrollIndicator(true);
      } else {
        setShowScrollIndicator(false);
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => el.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // ── Parse JSONB fields ──
  const itinerary: DayItinerary[] = Array.isArray(pkg.itinerary)
    ? pkg.itinerary
    : [];

  const hotels: HotelEntry[] = Array.isArray(pkg.hotels) ? pkg.hotels : [];

  const included: string[] = Array.isArray(pkg.included) ? pkg.included : [];
  const notIncluded: string[] = Array.isArray(pkg.not_included)
    ? pkg.not_included
    : [];

  const tourCities = (pkg.visited_cities ?? [])
    .filter((c) => c.latitude && c.longitude)
    .map((c, i, arr) => ({
      name: c.name,
      lat: c.latitude!,
      lng: c.longitude!,
      isStart: i === 0,
      isEnd: i === arr.length - 1,
    }));

  return (
    <div className="min-h-screen bg-gradient-theme">
      {/* ── HERO + DESCRIPTION BAND ── */}
      <PackageHero pkg={pkg} locale={locale} />

      {/* ── MAIN LAYOUT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-16 py-12">
        <div className="grid grid-cols-1 gap-10">
          <div>
            {/* ── TAB BAR ── */}
            <div className="relative">
              {/* 👉 Indicador de Scroll - SOLO MOBILE */}
              {isMobile && showScrollIndicator && (
                <div
                  className={`absolute top-1/5 -translate-y-1/2 z-30 pointer-events-none transition-all duration-300 ${
                    isAtEnd ? "left-0" : "right-0"
                  }`}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg h-10 w-10 flex items-center justify-center">
                    {isAtEnd ? (
                      <img
                        src="/swipe-right.svg"
                        alt="Swipe right indicator"
                        className="hand-icon-right"
                      />
                    ) : (
                      <img
                        src="/swipe-left.svg"
                        alt="Swipe left indicator"
                        className="hand-icon-left"
                      />
                    )}
                  </div>
                </div>
              )}

              <div
                ref={tabsScrollRef}
                className="flex gap-0 border-b border-[var(--border)]/40 mb-10 pb-4 overflow-x-auto"
              >
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-5 py-3 text-lg font-bold mb-3 tracking-wider uppercase whitespace-nowrap transition-all duration-200 border-b-2 -mb-[2px] ${
                      activeTab === tab.key
                        ? "text-[var(--accent)] border-[var(--accent)]"
                        : "text-[var(--accent)]/40 border-transparent hover:text-[var(--accent)]/70"
                    }`}
                  >
                    {t(locale, tab.label[0], tab.label[1])}
                  </button>
                ))}
              </div>
            </div>

            {/* ── TAB CONTENT ── */}
            {activeTab === "itinerary" && (
              <ItineraryTab
                itinerary={itinerary}
                included={included}
                notIncluded={notIncluded}
                locale={locale}
              />
            )}
            {activeTab === "optionals" && (
              <OptionalsTab locale={locale} optionals={optionals} />
            )}
            {activeTab === "hotels" && (
              <HotelsTab hotels={hotels} locale={locale} />
            )}
            {activeTab === "prices" && <PricesTab pkg={pkg} locale={locale} />}

            {/* ── MAP ── */}
            <div className="mt-12 text-center">
              <h3 className="text-theme text-center uppercase text-lg font-bold mb-3 tracking-wider">
                {t(locale, "ruta del viaje", "tour route")}
              </h3>
              <TourMap
                cities={tourCities}
                caption={tourCities.map((c) => c.name).join(", ")}
              />
            </div>

            {/* ── NOTES SECTION ── */}
            <PackageNotes notes={pkg.notes} locale={locale} className="mt-12" />

            {/* ── SIDEBAR ── */}
            <PackageSidebar pkg={pkg} locale={locale} />

            {/* ── BACK ── */}
            <div className="mt-4">
              <ButtonArrow
                title={t(locale, "Ver todos los paquetes", "View all packages")}
                onClick={() =>
                  router.push(
                    `/${locale}${locale === "es" ? "/paquetes" : "/packages"}`,
                  )
                }
              />
            </div>

            {/* ── SIMILAR PACKAGES ── */}
            {similarPackages.length > 0 && (
              <div className="mt-12 border-t border-[var(--border)]/40 pt-12">
                <SimilarPackages packages={similarPackages} locale={locale} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
