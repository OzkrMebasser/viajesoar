import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/locale";
import type { DestinationCountry } from "@/types/destinations";

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
