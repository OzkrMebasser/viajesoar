"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { MapPin, Ticket, DollarSign } from "lucide-react";
import { useActivityBySlug, useCityBySlug, useCountryBySlug } from "@/lib/hooks/useDestinations";

export default function ActivityPage() {
  const locale = useLocale() as "es" | "en";
  const params = useParams();

  const activitySlug =
    typeof params.activitySlug === "string" ? params.activitySlug : "";
  const citySlug =
    typeof params.destinationCitySlug === "string" ? params.destinationCitySlug : "";
  const countrySlug =
    typeof params.countrySlug === "string" ? params.countrySlug : "";

  // 1️⃣ Cargar actividad
  const { activity, loading: activityLoading, error: activityError } =
    useActivityBySlug(activitySlug, locale);

  // 2️⃣ Cargar ciudad / destino
  const { destination: city, loading: cityLoading } =
    useCityBySlug(citySlug, locale);

  // 3️⃣ Cargar país
  const { country, loading: countryLoading } = useCountryBySlug(countrySlug, locale);

  // ================= LOADING =================
  if (activityLoading || cityLoading || countryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-theme text-theme">
        <div className="text-center">
          <div className="inline-block animate-spin h-12 w-12 border-4 border-[var(--accent)] border-t-transparent rounded-full mb-4" />
          <p>{locale === "es" ? "Cargando actividad..." : "Loading activity..."}</p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (activityError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-theme text-theme">
        <p className="text-red-500 font-semibold">
          {locale === "es" ? "Error al cargar la actividad" : "Error loading activity"}
        </p>
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-theme text-theme">
        <div className="text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl font-semibold">
            {locale === "es" ? "Actividad no encontrada" : "Activity not found"}
          </p>
        </div>
      </div>
    );
  }

  // ================= VALIDACIÓN JERARQUÍA =================
  if (city && activity.destination_id !== city.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-theme text-theme">
        <p className="text-xl font-semibold text-red-500">
          {locale === "es"
            ? "Esta actividad no pertenece a esta ciudad"
            : "This activity does not belong to this city"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-theme text-theme">
      {/* ================= HERO ================= */}
      <div className="relative h-[420px] w-full overflow-hidden">
        <img
          src={activity.photos?.[0] || city?.image || ""}
          alt={activity.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 flex items-center">
          <div className="max-w-7xl mx-auto px-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-[var(--accent)]/20">
                <Ticket className="w-6 h-6" />
              </div>
              <div className="h-1 w-12 bg-[var(--accent)] rounded-full" />
            </div>
            <h1 className="text-5xl font-bold mb-4">{activity.name}</h1>
            {city && country && (
              <p className="text-lg text-white/90 flex gap-2">
                <MapPin className="w-5 h-5" />
                {city.name}, {country.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-6">
        {activity.price !== null && (
          <p className="flex items-center gap-2 text-xl font-semibold">
            <DollarSign className="w-5 h-5" />
            {locale === "es" ? "Precio:" : "Price:"} ${activity.price}
          </p>
        )}

        <div className="bg-gradient-theme-tertiary border border-theme rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            {locale === "es" ? "Descripción" : "Description"}
          </h2>
          <p className="text-theme-tittles leading-relaxed">{activity.description}</p>
        </div>
      </div>
    </div>
  );
}
