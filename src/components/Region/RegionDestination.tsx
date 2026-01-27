"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  useDestinationBySlug,
  useCountriesByRegion,
} from "@/lib/hooks/useDestinations";
import { ArrowRight, MapPin, Plane } from "lucide-react";

export default function RegionDestination() {
  const locale = useLocale() as "es" | "en";
  const params = useParams();
 const basePath =  locale === "es" ? "destinos" : "destinations";
  // ✅ el slug dinámico DEBE llamarse igual que la carpeta
  const regionSlug =
    typeof params.regionSlug === "string" ? params.regionSlug : "";

  // 1️⃣ Obtener la región por slug
  const {
    destination: region,
    loading: regionLoading,
    error: regionError,
  } = useDestinationBySlug(regionSlug, locale);

  // 2️⃣ Obtener países SOLO cuando exista region.id
  const {
    countries,
    loading: countriesLoading,
    error: countriesError,
  } = useCountriesByRegion(region?.id, locale);

  // 🔹 Loading principal
  if (regionLoading) {
    return (
      <div className="min-h-screen bg-gradient-theme text-theme flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent)] border-t-transparent mb-4"></div>
          <p className="text-lg">
            {locale === "es" ? "Cargando región..." : "Loading region..."}
          </p>
        </div>
      </div>
    );
  }

  // 🔹 Error región
  if (regionError) {
    return (
      <div className="min-h-screen bg-gradient-theme text-theme flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
            <p className="text-red-500 font-semibold">
              {locale === "es"
                ? "Error al cargar la región"
                : "Error loading region"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 Región no encontrada
  if (!region) {
    return (
      <div className="min-h-screen bg-gradient-theme text-theme flex items-center justify-center p-8">
        <div className="text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-[var(--accent)] opacity-50" />
          <p className="text-xl font-semibold">
            {locale === "es" ? "Región no encontrada" : "Region not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-theme text-theme">
      {/* ================= HERO REGION ================= */}
      <div className="relative h-[380px] w-full overflow-hidden">
        <img
          src={region.image}
          alt={region.name}
          className="w-full h-full object-cover"
        />

        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-[var(--accent)]/20 backdrop-blur-sm">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div className="h-1 w-12 bg-[var(--accent)] rounded-full" />
            </div>
            <h1 className="text-5xl font-bold mb-4 text-white">
              {region.name}
            </h1>
            <p className="text-lg max-w-2xl text-white/90 leading-relaxed">
              {region.description}
            </p>
          </div>
        </div>
      </div>

      {/* ================= COUNTRIES ================= */}
      <div className="relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-[var(--accent)] rounded-full" />
              <h2 className="text-3xl font-bold text-theme">
                {locale === "es" ? "Países" : "Countries"}
              </h2>
            </div>
            <p className="text-theme-tittles ml-7">
              {locale === "es"
                ? "Descubre los destinos disponibles en esta región"
                : "Discover the available destinations in this region"}
            </p>
          </div>

          {/* 🔹 Loading países */}
          {countriesLoading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent)] border-t-transparent mb-4"></div>
              <p className="text-theme-tittles">
                {locale === "es" ? "Cargando países..." : "Loading countries..."}
              </p>
            </div>
          )}

          {/* 🔹 Error países */}
          {countriesError && (
            <div className="p-8 rounded-xl bg-red-500/5 border border-red-500/20 text-center">
              <p className="text-red-500 font-semibold">
                {locale === "es"
                  ? "Error al cargar los países"
                  : "Error loading countries"}
              </p>
            </div>
          )}

          {/* 🔹 Sin países */}
          {!countriesLoading && countries.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-theme p-16 text-center bg-[var(--accent)]/5">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-[var(--accent)] opacity-50" />
              <p className="text-xl font-semibold text-theme mb-2">
                {locale === "es"
                  ? "Aún no hay países disponibles en esta región"
                  : "No countries available in this region yet"}
              </p>
              <p className="text-theme-tittles">
                {locale === "es"
                  ? "Pronto agregaremos nuevos destinos ✈️"
                  : "We're working on adding new destinations ✈️"}
              </p>
            </div>
          )}

          {/* 🔹 Grid países */}
          {countries.length > 0 && (
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries.map((country) => (
                
                <Link
                  key={country.id}
                  
                  href={`/${locale}/${basePath}/${region.slug}/${country.slug}`}
                  className="group rounded-xl overflow-hidden bg-gradient-theme-tertiary border border-theme shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {/* IMAGE */}
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={country.image}
                      alt={country.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-theme group-hover:text-[var(--accent)] transition-colors duration-300">
                        {country.name}
                      </h3>
                      <ArrowRight className="w-5 h-5 text-[var(--accent)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <p className="text-sm text-theme-tittles line-clamp-2 leading-relaxed">
                      {country.description}
                    </p>
                    
                    {/* Decorative line */}
                    <div className="mt-4 h-0.5 w-0 group-hover:w-full bg-[var(--accent)] transition-all duration-300 rounded-full" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}