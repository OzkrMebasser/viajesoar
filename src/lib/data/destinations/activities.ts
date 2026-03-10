import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/locale";
import type { OptionalActivity } from "@/types/activities"
/* =====================================================
   ACTIVIDAD INDIVIDUAL (POR SLUG)
   ===================================================== */
export async function getActivityBySlug(
  slug: string,
  locale: Locale
): Promise<OptionalActivity  | null> {
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
): Promise<OptionalActivity []> {
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

// async function hydrateOptionals(ids: string[]): Promise<OptionalActivity[]> {
//   const supabase = await createClient();

//   if (!ids.length) return [];

//   const { data, error } = await supabase
//     .from("destinations_activities")
//     .select(`
//     id,
//     name,
//     locale,
//     description,
//     price_from,
//     price_to,
//     currency,
//     duration,
//     cover_image,
//     photos
//   `)
//     .in("id", ids)
//     .eq("is_active", true);

//   if (error) {
//     console.error("Error fetching optionals:", error);
//     return [];
//   }

//   return data ?? [];
// }


// Agregar `export` y los campos faltantes
export async function hydrateOptionals(
  ids: string[],
  locale: Locale
): Promise<OptionalActivity[]> {
  const supabase = await createClient();
  if (!ids.length) return [];

  const { data, error } = await supabase
    .from("destinations_activities")
    .select(`
      id,
      name,
      locale,
      description,
      description_sections,
      notes,
      price,
      price_from,
      price_to,
      currency,
      cover_image,
      tags,
      photos,
      category,
      duration,
      recommended_time,
      difficulty_level,
      activity_mode,
      activity_type,
      included,
      not_included,
      address,
      is_featured,
      is_recommended
    `)
    .in("id", ids)
    .eq("locale", locale)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching optionals:", error);
    return [];
  }

  return data ?? [];
}