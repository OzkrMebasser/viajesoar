import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/locale";
import type { Activity } from "@/types/activities";

/* =====================================================
   ACTIVIDAD INDIVIDUAL (POR SLUG)
   ===================================================== */
export async function getActivityBySlug(
  slug: string,
  locale: Locale
): Promise<Activity | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations_activities")
    .select("*")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    console.error("Error fetching activity:", error);
    return null;
  }

  return data;
}

/* =====================================================
   ACTIVIDADES POR DESTINO (CIUDAD)
   ===================================================== */
export async function getActivitiesByDestination(
  destinationId: string,
  locale: Locale
): Promise<Activity[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations_activities")
    .select("*")
    .eq("destination_id", destinationId)
    .eq("locale", locale)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching activities:", error);
    return [];
  }

  return data ?? [];
}
