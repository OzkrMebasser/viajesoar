"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { MapPin, Globe2 } from "lucide-react";
import { useCityBySlug, useCountryBySlug, useActivitiesByDestination } from "@/lib/hooks/useDestinations";

export default function CityDestination() {
  const locale = useLocale() as "es" | "en";
  const params = useParams();

  const citySlug = typeof params.destinationCitySlug === "string" ? params.destinationCitySlug : "";
  const countrySlug = typeof params.countrySlug === "string" ? params.countrySlug : "";

  // 1️⃣ Ciudad / destino
  const { destination, loading: destinationLoading, error: destinationError } = useCityBySlug(citySlug, locale);

  // 2️⃣ País (solo para validar jerarquía y mostrar info)
  const { country, loading: countryLoading } = useCountryBySlug(countrySlug, locale);

  // 3️⃣ Actividades
const { activities, loading: activitiesLoading } = useActivitiesByDestination(destination?.id || "", locale);

  console.log("Activities", activities.map(a => a.name));
  // ================= LOADING =================
  if (destinationLoading || countryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-theme text-theme">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent)] border-t-transparent mb-4" />
          <p>{locale === "es" ? "Cargando destino..." : "Loading destination..."}</p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (destinationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-theme text-theme">
        <p className="text-red-500 font-semibold">
          {locale === "es" ? "Error al cargar el destino" : "Error loading destination"}
        </p>
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-theme text-theme">
        <div className="text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl font-semibold">
            {locale === "es" ? "Destino no encontrado" : "Destination not found"}
          </p>
        </div>
      </div>
    );
  }

  // ================= VALIDACIÓN JERARQUÍA =================
  if (country && destination.country_id !== country.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-theme text-theme">
        <p className="text-xl font-semibold text-red-500">
          {locale === "es" ? "Este destino no pertenece a este país" : "This destination does not belong to this country"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-theme text-theme">
      {/* ================= HERO ================= */}
      <div className="relative h-[420px] w-full overflow-hidden">
        <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 flex items-center">
          <div className="max-w-7xl mx-auto px-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-[var(--accent)]/20">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="h-1 w-12 bg-[var(--accent)] rounded-full" />
            </div>
            <h1 className="text-5xl font-bold mb-4">{destination.name}</h1>
            {country && (
              <p className="text-lg text-white/90 flex items-center gap-2">
                <Globe2 className="w-5 h-5" />
                {country.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        {/* Sobre el destino */}
        <div className="bg-gradient-theme-tertiary border border-theme rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">{locale === "es" ? "Sobre este destino" : "About this destination"}</h2>
          <p className="text-theme-tittles leading-relaxed">{destination.description}</p>
        </div>

        {/* Actividades */}
        <div className="bg-gradient-theme-tertiary border border-theme rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">{locale === "es" ? "Actividades" : "Activities"}</h2>

          {activitiesLoading ? (
            <p>{locale === "es" ? "Cargando actividades..." : "Loading activities..."}</p>
          ) : activities.length > 0 ? (
            <ul className="space-y-3">
              {activities.map((activity) => (
                <li key={activity.id} className="p-4 border border-theme rounded-xl">
                  <h3 className="font-semibold text-lg">{activity.name}</h3>
                  <p className="text-sm text-theme-tittles">{activity.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>{locale === "es" ? "No hay actividades disponibles" : "No activities available"}</p>
          )}
        </div>
      </div>
    </div>
  );
}
