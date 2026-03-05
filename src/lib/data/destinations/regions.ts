import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/locale";
import type { RegionHome, DestinationRegion, DestinationCountry } from "@/types/destinations";


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