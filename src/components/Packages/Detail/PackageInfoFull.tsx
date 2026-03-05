"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

import TourMap from "../TourMap";
import SimilarPackages from "@/components/Packages/SimilarPackages";
import ButtonArrow from "@/components/ui/ButtonArrow";

// ── Subcomponents ──
import PackageHero from "./PackageHero";
import PackageSidebar from "./PackageSidebar";
import ItineraryTab from "./tabs/ItineraryTab";
import OptionalsTab from "./tabs/OptionalsTab";
import HotelsTab from "./tabs/HotelsTab";
import PricesTab from "./tabs/PricesTab";

// ── Types ──
import type { TabType, DayItinerary, HotelEntry, PackageDetail, Package } from "@/types/packages";

type Locale = "es" | "en";
const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

interface Props {
  locale: Locale;
  pkg: PackageDetail;
  similarPackages?: Package[];
}

const TABS: { key: TabType; label: [string, string] }[] = [
  { key: "itinerary", label: ["Itinerario", "Itinerary"] },
  { key: "optionals", label: ["Opcionales", "Optionals"] },
  { key: "hotels",    label: ["Hoteles",    "Hotels"]    },
  { key: "prices",    label: ["Tarifas",    "Prices"]    },
];

export default function PackageInfoFull({
  pkg,
  locale,
  similarPackages = [],
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("itinerary");
  const [openMap, setOpenMap] = useState(false);

  // ── Parse JSONB fields ──
  const itinerary: DayItinerary[] = Array.isArray(pkg.itinerary) ? pkg.itinerary : [];
  const hotels: HotelEntry[] = Object.entries(
    (pkg.hotels as unknown as Record<string, Record<string, string[]>>) || {},
  ).flatMap(([country, cities]) =>
    Object.entries(cities).flatMap(([city, hotelList]) =>
      hotelList.map((hotel) => ({ country, city, hotel })),
    ),
  );
  const included: string[]    = Array.isArray(pkg.included)     ? pkg.included     : [];
  const notIncluded: string[] = Array.isArray(pkg.not_included) ? pkg.not_included : [];

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
            <div className="flex gap-0 border-b border-[var(--border)]/40 mb-10 pb-4 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-3 text-xs font-semibold tracking-[0.12em] uppercase whitespace-nowrap transition-all duration-200 border-b-2 -mb-[2px] ${
                    activeTab === tab.key
                      ? "text-[var(--accent)] border-[var(--accent)]"
                      : "text-[var(--accent)]/40 border-transparent hover:text-[var(--accent)]/70"
                  }`}
                >
                  {t(locale, tab.label[0], tab.label[1])}
                </button>
              ))}
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
            {activeTab === "optionals" && <OptionalsTab locale={locale} />}
            {activeTab === "hotels"    && <HotelsTab hotels={hotels} locale={locale} />}
            {activeTab === "prices"    && <PricesTab pkg={pkg} locale={locale} />}

            {/* ── MAP ── */}
            <div className="mt-8 text-center">
              <h3 className="text-theme uppercase mb-4">
                {t(locale, "ruta del viaje", "tour route")}
              </h3>
              <TourMap
                cities={tourCities}
                caption={tourCities.map((c) => c.name).join(", ")}
              />
            </div>

            {/* ── SIDEBAR ── */}
            <PackageSidebar pkg={pkg} locale={locale} />

            {/* ── BACK ── */}
            <div className="mt-4">
              <ButtonArrow
                title={t(locale, "Ver todos los paquetes", "View all packages")}
                onClick={() =>
                  router.push(`/${locale}${locale === "es" ? "/paquetes" : "/packages"}`)
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

      {/* ── MAP MODAL ── */}
      {/* {openMap && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setOpenMap(false)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] rounded-lg overflow-hidden border border-[var(--border)]/40"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenMap(false)}
              className="absolute top-4 right-4 z-50 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button> */}
            <div className="h-[80vh]">
              <TourMap
                cities={tourCities}
                height={800}
                caption={tourCities.map((c) => c.name).join(", ")}
              />
            </div>
          {/* </div>
        </div>
      )} */}

    </div>
  );
}