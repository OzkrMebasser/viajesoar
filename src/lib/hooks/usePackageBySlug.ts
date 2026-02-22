// src/lib/hooks/usePackageBySlug.ts


// src/lib/hooks/usePackageBySlug.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  optional?: string | null;
}

export interface HotelEntry {
  country: string;
  city: string;
  hotel: string;
  type?: string;
}

export interface Package {
  // ── Identity ──
  id: string;
  locale: string;
  name: string;
  slug: string;
  description: string;

  // ── Provider ──
  provider_internal: string | null;
  provider_id: string | null;
  provider_pkg_id: string | null;
  internal_pkg_id: string | null;
  provider_type: string | null;
  provider_ui: string | null;

  // ── Media ──
  images: string[];
  home_carousel_images: string[];

  // ── Duration ──
  duration: string | null;
  days: number | null;
  nights: number | null;

  // ── Pricing ──
  price_from: number;
  price_single: number | null;
  price_triple: number | null;
  price_child: number | null;
  price_infant: number | null;
  currency: string;
  taxes: number | null;
  prices_valid_until: string | null;
  deposit_amount: number | null;

  // ── Content ──
  itinerary: DayItinerary[] | null;
  hotels: HotelEntry[] | null;
  included: string[] | null;
  not_included: string[] | null;

  // ── Logistics ──
  includes_flight: boolean | null;
  airlines: string[] | null;
  departure_city: string | null;
  min_passengers: number | null;

  // ── Relations (UUIDs — resueltos a objetos si hay datos) ──
  region_id: string | null;
  country_id: string | null;
  visited_cities: { id: string; name: string; slug: string }[];
  visited_countries: { id: string; name: string; slug: string }[];
  optional_activities: string[];

  // ── Flags ──
  is_active: boolean;
  is_featured: boolean;
  is_home_carousel: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePackageBySlug(slug: string, locale: "es" | "en") {
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchPackage() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: pkgError } = await supabase
          .from("packages")
          .select("*")
          .eq("slug", slug)
          .eq("locale", locale)
          .eq("is_active", true)
          .single();

        if (pkgError) throw pkgError;
        if (!data) {
          setPkg(null);
          return;
        }

        // Resolver cities/countries solo si tienen UUIDs reales
        const cityIds: string[] = data.visited_cities || [];
        const countryIds: string[] = data.visited_countries || [];

        let cities: { id: string; name: string; slug: string }[] = [];
        let countries: { id: string; name: string; slug: string }[] = [];

        if (cityIds.length > 0) {
          const { data: cityData } = await supabase
            .from("destinations")
            .select("id, name, slug")
            .in("id", cityIds);
          cities = cityData || [];
        }

        if (countryIds.length > 0) {
          const { data: countryData } = await supabase
            .from("destinations_countries")
            .select("id, name, slug")
            .in("id", countryIds);
          countries = countryData || [];
        }

        setPkg({
          ...data,
          visited_cities: cityIds.map(
            (id) => cities.find((c) => c.id === id) || { id, name: "N/A", slug: "" }
          ),
          visited_countries: countryIds.map(
            (id) => countries.find((c) => c.id === id) || { id, name: "N/A", slug: "" }
          ),
        });
      } catch (err: any) {
        setError(err.message || "Error fetching package");
        setPkg(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPackage();
  }, [slug, locale]);

  return { pkg, loading, error };
}


// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase";

// export interface Package {
//   id: string;
//   locale: string;
//   name: string;
//   slug: string;
//   description: string;
//   visited_cities: { id: string; name: string; slug: string }[];
//   visited_countries: { id: string; name: string; slug: string }[];
//   optional_activities: string[];
//   images: string[];
//   duration: string;
//   price_from: number;
//   currency: string;
//   region_id: string;
//   is_active: boolean;
//   is_featured: boolean;
// }

// export function usePackageBySlug(slug: string, locale: "es" | "en") {
//   const [pkg, setPkg] = useState<Package | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!slug) return;

//     async function fetchPackage() {
//       try {
//         setLoading(true);
        
//         // 1️⃣ Traer el paquete
//         const { data: pkgData, error: pkgError } = await supabase
//           .from("packages")
//           .select("*")
//           .eq("slug", slug)
//           .eq("locale", locale)
//           .eq("is_active", true)
//           .single();

//         if (pkgError) throw pkgError;
//         if (!pkgData) {
//           setPkg(null);
//           return;
//         }

//         // 2️⃣ Traer ciudades
//         const cityIds = pkgData.visited_cities || [];
//         const { data: cities } = await supabase
//           .from("destinations")
//           .select("id, name, slug")
//           .in("id", cityIds);

//         // 3️⃣ Traer países
//         const countryIds = pkgData.visited_countries || [];
//         const { data: countries } = await supabase
//           .from("destinations_countries")
//           .select("id, name, slug")
//           .in("id", countryIds);

//         // 4️⃣ Combinar todo
//         const formatted = {
//           ...pkgData,
//           visited_cities: cityIds.map(
//             (id: string) => cities?.find(c => c.id === id) || { id, name: "N/A", slug: "" }
//           ),
//           visited_countries: countryIds.map(
//             (id: string) => countries?.find(c => c.id === id) || { id, name: "N/A", slug: "" }
//           ),
//         };

//         setPkg(formatted);
//       } catch (err: any) {
//         setError(err.message || "Error fetching package");
//         setPkg(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchPackage();
//   }, [slug, locale]);

//   return { pkg, loading, error };
// }