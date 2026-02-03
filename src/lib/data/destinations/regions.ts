import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/locale";
import type { DestinationRegion } from "@/types/destinations";


export async function getDestinationRegions(
  locale: Locale
) {
  const supabase = await createClient();
    console.log("Fetched data (regions)", supabase);

  const { data, error } = await supabase
    .from("destinations_regions")
    .select("*")
    .eq("locale", locale)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
 
  console.log("Data from server", data)
  return data ;
}

