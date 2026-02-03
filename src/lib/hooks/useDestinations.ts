import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/* =====================================================
   TIPOS (MODELOS DE DATOS)
   ===================================================== */

export interface DestinationRegion {
  id: string;
  name: string;
  description: string;
  image: string;
  gradient: string;
  icon: string;
  locale: string;
  is_active: boolean;
  order_index?: number;
  slug: string;
}

export interface DestinationCountry {
  id: string;
  locale: "es" | "en";
  name: string;
  slug: string;
  description: string;
  image: string;
  region_id: string;
  order_index: number;
  is_active: boolean;
  // created_at: string;

}

export interface Destination {
  id: string;
  locale: string;
  name: string;
  country: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  duration: string;
  description: string;
  category: string;
  slug: string;
  highlights: string[];
  country_id: string;
  is_featured: boolean;
  is_active: boolean;
}


export interface Activity {
  id: string;
  locale: string;
  name: string;
  slug: string;
  description: string;
  category: "tour" | "free-activity";
  price: number | null;
  photos: string[];
  destination_id: string;
  is_active: boolean;
}

/* =====================================================
   REGIONES (HOME / SLIDER / LANDING)
   ===================================================== */

/**
 * Obtiene todas las regiones activas por idioma
 * Usado en Home / Landing
 */
export function useDestinationRegions(locale: "es" | "en" = "es") {
  const [regions, setRegions] = useState<DestinationRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRegions() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("destinations_regions")
          .select("*")
          .eq("locale", locale)
          .eq("is_active", true)
          .order("order_index", { ascending: true });

        // console.log("Regions...", data);

        if (error) throw error;

        setRegions(data || []);
      } catch (err) {
        console.error("Error fetching regions:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    fetchRegions();
  }, [locale]);

  return { regions, loading, error };
}

/* =====================================================
   REGIÓN INDIVIDUAL (POR SLUG)
   ===================================================== */

/**
 * Obtiene UNA región por slug (URL)
 * /destinos/[regionSlug]
 */
export function useDestinationBySlug(slug: string, locale: string) {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestination() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("destinations_regions")
          .select("*")
          .eq("slug", slug)
          .eq("locale", locale)
          .limit(1);

        if (error) throw error;

        setDestination(data?.[0] || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchDestination();
  }, [slug, locale]);

  return { destination, loading, error };
}

/* =====================================================
   PAÍSES
   ===================================================== */

/**
 * Obtiene un país por slug
 * /destinos/[region]/[country]
 */
export function useCountryBySlug(slug: string, locale: "es" | "en" = "es") {
  const [country, setCountry] = useState<DestinationCountry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchCountry() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("destinations_countries")
          .select("*")
          .eq("slug", slug)
          .eq("locale", locale)
          .eq("is_active", true)
          .single();

        if (error) throw error;

        setCountry(data);
      } catch (err: any) {
        console.error("Error fetching country:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCountry();
  }, [slug, locale]);

  return { country, loading, error };
}

/**
 * Obtiene países por región (UUID)
 * /destinos/[region]
 */
export function useCountriesByRegion(
  regionId?: string,
  locale: "es" | "en" = "es"
) {
  const [countries, setCountries] = useState<DestinationCountry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isUUID =
    typeof regionId === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      regionId
    );

  useEffect(() => {
    if (!isUUID) {
      console.warn("⛔ regionId inválido:", regionId);
      setCountries([]);
      setLoading(false);
      setError(null);
      return;
    }

    async function fetchCountries() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("destinations_countries")
          .select(`
            id,
            name,
            slug,
            description,
            image,
            region_id,
            locale,
            is_active,
            order_index
          `)
          .eq("region_id", regionId)
          .eq("locale", locale)
          .eq("is_active", true)
          .order("order_index", { ascending: true });

        if (error) throw error;

        setCountries(data ?? []);
      } catch (err) {
        console.error("❌ Error fetching countries:", err);
        setError("No se pudieron cargar los países");
        setCountries([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, [regionId, locale]);

  return {
    countries,
    loading,
    error,
    isEmpty: !loading && countries.length === 0,
  };
}

/* =====================================================
   CIUDADES / DESTINOS INDIVIDUALES
   ===================================================== */

/**
 * Obtiene una ciudad / destino por slug
 * /destinos/[region]/[country]/[city]
 */
export function useCityBySlug(slug: string, locale: "es" | "en") {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchCity() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("destinations")
          .select("*")
          .eq("slug", slug)
          .eq("locale", locale)
          .eq("is_active", true)
          .single();

        if (error) throw error;

        setDestination(data);
      } catch (err: any) {
        console.error("❌ Error fetching city:", err);
        setError(err.message || "Error loading city");
        setDestination(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCity();
  }, [slug, locale]);

  return { destination, loading, error };
}

/* =====================================================
   DESTINOS (LISTADOS GENERALES)
   ===================================================== */

/**
 * Obtiene todos los destinos activos por idioma
 */
// export const useDestinations = (locale: "es" | "en" = "es") => {
//   const [destinations, setDestinations] = useState<Destination[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDestinations = async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("destinations")
//           .select("*")
//           .eq("locale", locale)
//           .eq("is_active", true)
//           .order("name", { ascending: true });

//         if (error) throw error;

//         if (data) {
//           const formatted = data.map((d: any) => ({
//             ...d,
//             highlights: [d.highlight_1, d.highlight_2, d.highlight_3].filter(
//               Boolean
//             ),
//           }));
//           setDestinations(formatted);
//         }
//       } catch (err: any) {
//         console.error(err);
//         setError(err.message || "Error fetching destinations");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDestinations();
//   }, [locale]);

//   return { destinations, loading, error };
// };

/* =====================================================
   DESTINOS AGRUPADOS POR REGIÓN → PAÍSES → CIUDADES
   ===================================================== */

export function useDestinationsByRegion(
  region_id: string,
  locale: "es" | "en" = "es"
) {
  const [countries, setCountries] = useState<
    (DestinationCountry & { destinations: Destination[] })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!region_id) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("destinations")
          .select(`
            *,
            country:country_id (
              id,
              name,
              slug,
              description,
              image,
              region_id
            )
          `)
          .eq("locale", locale)
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (error) throw error;

        if (!data) {
          setCountries([]);
          return;
        }

        const filtered = data.filter(
          (d: any) => d.country && d.country.region_id === region_id
        );

        const countriesMap: Record<
          string,
          DestinationCountry & { destinations: Destination[] }
        > = {};

        filtered.forEach((dest: any) => {
          const country = dest.country;

          if (!countriesMap[country.id]) {
            countriesMap[country.id] = {
              ...country,
              destinations: [],
            };
          }

          countriesMap[country.id].destinations.push(dest);
        });

        const result = Object.values(countriesMap).map((country) => ({
          ...country,
          destinations: country.destinations.sort((a, b) =>
            a.name.localeCompare(b.name)
          ),
        }));

        setCountries(result);
      } catch (err: any) {
        console.error("Error fetching destinations by region:", err);
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [region_id, locale]);

  return { countries, loading, error };
}


/**
 * 

 */

 /* =====================================================
    DESTINOS ACTIVIDADES
   ===================================================== */

 export function useActivityBySlug(slug: string, locale: "es" | "en") {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchActivity() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("destinations_activities")
          .select("*")
          .eq("slug", slug)
          .eq("locale", locale)
          .eq("is_active", true)
          .single();

        if (error) throw error;

        setActivity(data);
      } catch (err: any) {
        console.error("Error fetching activity:", err);
        setError(err.message || "Error loading activity");
        setActivity(null);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, [slug, locale]);

  return { activity, loading, error };
}

export function useActivitiesByDestination(destinationId: string, locale: "es" | "en") {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!destinationId) return;

    async function fetchActivities() {
      try {
        setLoading(true);
        setError(null);

        // 🔹 Solo para debug, quita filtros si quieres ver si hay datos
        const { data, error } = await supabase
          .from("destinations_activities")
          .select("*")
          .eq("destination_id", destinationId)
          // .eq("locale", locale) // temporalmente comentalo
          // .eq("is_active", true) // temporalmente comentalo
          .order("name", { ascending: true });

        console.log("🚀 Fetched activities for", destinationId, ":", data, "Error:", error);

        if (error) throw error;
        setActivities(data || []);
      } catch (err: any) {
        console.error("Error fetching activities:", err);
        setError(err.message || "Error loading activities");
        setActivities([]);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, [destinationId, locale]);

  return { activities, loading, error };
}

/* =====================================================
   UTILIDADES DE BÚSQUEDA Y FILTROS
   ===================================================== */

export async function searchDestinations(
  query: string,
  lang: "es" | "en" = "es"
) {
  const nameField = lang === "es" ? "name_es" : "name_en";
  const countryField = lang === "es" ? "country_es" : "country_en";
  const descriptionField = lang === "es"
    ? "description_es"
    : "description_en";

  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .or(
      `${nameField}.ilike.%${query}%,${countryField}.ilike.%${query}%,${descriptionField}.ilike.%${query}%`
    )
    .eq("is_active", true);

  if (error) throw error;
  return data;
}

export async function getDestinationsByCategory(
  categorySlug: string,
  lang: "es" | "en" = "es"
) {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("is_active", true);

  if (error) throw error;

  return data;
}

export async function getDestinationsByPriceRange(min: number, max: number) {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .gte("price", min)
    .lte("price", max)
    .eq("is_active", true);

  if (error) throw error;
  return data;
}
