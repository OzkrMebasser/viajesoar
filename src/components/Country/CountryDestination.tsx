"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  useCountryBySlug,
  useDestinations,
} from "@/lib/hooks/useDestinations";
import { ArrowRight, MapPin, Building2 } from "lucide-react";

export default function CountryDestination() {
  const locale = useLocale() as "es" | "en";
  const basePath =  locale === "es" ? "destinos" : "destinations";
  const params = useParams();

  const countrySlug =
    typeof params.countrySlug === "string" ? params.countrySlug : "";

  const regionSlug =
    typeof params.regionSlug === "string" ? params.regionSlug : "";

  // 1️⃣ País
  const {
    country,
    loading: countryLoading,
    error: countryError,
  } = useCountryBySlug(countrySlug, locale);

  // 2️⃣ Todos los destinos (ciudades)
  const {
    destinations,
    loading: destinationsLoading,
    error: destinationsError,
  } = useDestinations(locale);

  // 3️⃣ Filtrar destinos por país
  const cities = country
    ? destinations.filter(
        (d) => d.country_id === country.id && d.is_active
      )
    : [];

  // ================= LOADING =================
  if (countryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-theme text-theme">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent)] border-t-transparent mb-4" />
          <p>
            {locale === "es"
              ? "Cargando país..."
              : "Loading country..."}
          </p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (countryError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-theme text-theme">
        <p className="text-red-500 font-semibold">
          {locale === "es"
            ? "Error al cargar el país"
            : "Error loading country"}
        </p>
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-theme text-theme">
        <div className="text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl font-semibold">
            {locale === "es"
              ? "País no encontrado"
              : "Country not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-theme text-theme">
      {/* ================= HERO COUNTRY ================= */}
      <div className="relative h-[380px] w-full overflow-hidden">
        <img
          src={country.image}
          alt={country.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 flex items-center">
          <div className="max-w-7xl mx-auto px-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-[var(--accent)]/20">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="h-1 w-12 bg-[var(--accent)] rounded-full" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              {country.name}
            </h1>
            <p className="text-lg max-w-2xl text-white/90">
              {country.description}
            </p>
          </div>
        </div>
      </div>

      {/* ================= CITIES ================= */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">
          {locale === "es" ? "Ciudades" : "Cities"}
        </h2>

        {/* Loading ciudades */}
        {destinationsLoading && (
          <p className="text-center">
            {locale === "es"
              ? "Cargando ciudades..."
              : "Loading cities..."}
          </p>
        )}

        {/* Error ciudades */}
        {destinationsError && (
          <p className="text-center text-red-500">
            {locale === "es"
              ? "Error al cargar las ciudades"
              : "Error loading cities"}
          </p>
        )}

        {/* Sin ciudades */}
        {!destinationsLoading && cities.length === 0 && (
          <div className="border-2 border-dashed border-theme p-16 text-center rounded-xl">
            <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl font-semibold">
              {locale === "es"
                ? "Aún no hay ciudades disponibles en este país"
                : "No cities available in this country yet"}
            </p>
          </div>
        )}

        {/* Grid ciudades */}
        {cities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Link
                key={city.id}
                href={`/${locale}/${basePath}/${regionSlug}/${country.slug}/${city.slug}`}
                className="group rounded-xl overflow-hidden bg-gradient-theme-tertiary border border-theme hover:shadow-xl transition-all"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">
                      {city.name}
                    </h3>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <p className="text-sm text-theme-tittles line-clamp-2">
                    {city.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
