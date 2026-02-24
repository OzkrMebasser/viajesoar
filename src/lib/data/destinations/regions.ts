import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/locale";
import type { RegionHome } from "@/types/destinations";
export async function getDestinationRegions(
  locale: Locale,
): Promise<RegionHome[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("regions_home")  // 👈 también revisa que sea esta tabla, no "destinations_regions"
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