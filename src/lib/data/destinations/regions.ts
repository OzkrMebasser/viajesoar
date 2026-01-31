import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/locale";
import type { DestinationRegion } from "@/types/destinations";

export async function getDestinationRegions(
  locale: Locale
): Promise<DestinationRegion[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations_regions")
    .select("*")
    .eq("locale", locale)
    .eq("is_active", true)
    .order("order_index");

  if (error) {
    console.error("Error fetching regions:", error);
    return [];
  }

  return data ?? [];
}
