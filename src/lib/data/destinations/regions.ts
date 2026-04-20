import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/locale";
import type { RegionHome, DestinationRegion, DestinationCountry, Destination } from "@/types/destinations";


export async function getDestinationRegions(
  locale: Locale,
): Promise<RegionHome[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("regions_home")  
    .select("*")
    .eq("locale", locale)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching regions:", error);
    return [];
  }

  return data?.map((region) => ({
    ...region,
    images: typeof region.images === "string"
      ? JSON.parse(region.images)
      : region.images ?? [],
  })) ?? [];
}

export async function getAllRegions(locale: Locale): Promise<DestinationRegion[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations_regions")
    .select("*")
    .eq("locale", locale)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching all regions:", error);
    return [];
  }

  return data?.map((region) => ({
    ...region,
    images: typeof region.images === "string"
      ? JSON.parse(region.images)
      : region.images ?? [],
  })) ?? [];
}


export async function getRegionBySlug(
  slug: string,
  locale: Locale
): Promise<DestinationRegion | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations_regions")
    .select("*")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching region:", error);
    return null;
  }

  return {
    ...data,
    images: typeof data.images === "string"
      ? JSON.parse(data.images)
      : data.images ?? [],
  };
}

export async function getCountryBySlug(
  slug: string,
  locale: Locale
): Promise<DestinationCountry | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations_countries")
    .select("*")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching country:", error);
    return null;
  }

  return data;
}

export async function getCountriesByRegion(
  regionId: string,
  locale: Locale
): Promise<DestinationCountry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations_countries")
    .select("*")
    .eq("region_id", regionId)
    .eq("locale", locale)
    .eq("is_active", true)
    .order("order_index");

  if (error) {
    console.error("Error fetching countries:", error);
    return [];
  }

  return data ?? [];
}

// Tipos ligeros para el nav (subconjunto de los tipos existentes)
export type NavCity = Pick<Destination, "id" | "name" | "slug">;
export type NavCountry = Pick<DestinationCountry, "id" | "name" | "slug"> & {
  cities: NavCity[];
};
export type NavRegion = Pick<DestinationRegion, "id" | "name" | "slug" | "images" | "description"> & {
  countries: NavCountry[];
};

export async function getNavRegions(locale: Locale): Promise<NavRegion[]> {
  const supabase = await createClient();

  const { data: regions, error: regionsError } = await supabase
    .from("destinations_regions")
    .select("id, name, slug, images, description")
    .eq("locale", locale)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (regionsError || !regions) return [];

  const regionIds = regions.map((r) => r.id);
  const { data: countries, error: countriesError } = await supabase
    .from("destinations_countries")
    .select("id, name, slug, region_id")
    .eq("locale", locale)
    .eq("is_active", true)
    .in("region_id", regionIds)
    .order("order_index", { ascending: true });

  if (countriesError || !countries) return [];

  const countryIds = countries.map((c) => c.id);
  const { data: cities } = await supabase
    .from("destinations")
    .select("id, name, slug, country_id")
    .eq("locale", locale)
    .eq("is_active", true)
    .in("country_id", countryIds)
    .order("rating", { ascending: false })
    .limit(200);

  const citiesByCountry: Record<string, NavCity[]> = {};
  (cities ?? []).forEach((city) => {
    if (!citiesByCountry[city.country_id]) citiesByCountry[city.country_id] = [];
    if (citiesByCountry[city.country_id].length < 5) {
      citiesByCountry[city.country_id].push({
        id: city.id,
        name: city.name,
        slug: city.slug,
      });
    }
  });

  const countriesByRegion: Record<string, NavCountry[]> = {};
  countries.forEach((c) => {
    if (!countriesByRegion[c.region_id]) countriesByRegion[c.region_id] = [];
    countriesByRegion[c.region_id].push({
      id: c.id,
      name: c.name,
      slug: c.slug,
      cities: citiesByCountry[c.id] ?? [],
    });
  });

  return regions.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    images: typeof r.images === "string" ? JSON.parse(r.images) : r.images ?? [],
    description: r.description,
    countries: countriesByRegion[r.id] ?? [],
  }));
}

