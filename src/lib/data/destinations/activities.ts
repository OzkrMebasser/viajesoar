import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/locale";
import type { DestinationActivity, DestinationActivityWithLocation } from "@/types/activities";
import type { PaginatedResult } from "@/types/pagination";

export async function getActivityBySlug(
  slug: string,
  locale: Locale,
): Promise<DestinationActivity | null> {
  const supabase = await createClient();

  // console.log("Buscando actividad:", slug, locale); 

  const { data, error } = await supabase
    .from("destinations_activities")
    .select("*")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    console.error("Error fetching activity:", error);
    return null;
  }

  return data;
}

export async function getActivitiesByDestination(
  destinationId: string,
  locale: Locale,
): Promise<DestinationActivity[]> {
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

export async function hydrateOptionals(
  ids: string[],
  locale: Locale,
): Promise<DestinationActivity[]> {
  const supabase = await createClient();
  if (!ids.length) return [];

  const { data, error } = await supabase
    .from("destinations_activities")
    .select("*") 
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

/* =====================================================
   TODOS LOS TOURS / ACTIVIDADES (LISTADO GLOBAL)
   ===================================================== */

const PAGE_SIZE = 9;

export async function getAllActivities(
  locale: Locale,
  page = 1,
): Promise<PaginatedResult<DestinationActivity>> {
  const supabase = await createClient();

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from("destinations_activities")
    .select("*", { count: "exact" })
    .eq("locale", locale)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching all activities:", error);
    return { data: [], page, pageSize: PAGE_SIZE, total: 0, totalPages: 0 };
  }

  return {
    data: data ?? [],
    page,
    pageSize: PAGE_SIZE,
    total: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
  };
}

export async function getActivityBySlugWithLocation(
  slug: string,
  locale: Locale,
): Promise<DestinationActivityWithLocation | null> {
  const supabase = await createClient();

  const { data: activity, error } = await supabase
    .from("destinations_activities")
    .select("*")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !activity) return null;

  const [cityRes] = await Promise.all([
    supabase
      .from("destinations")
      .select("name, country_id")
      .eq("id", activity.destination_id)
      .eq("locale", locale)
      .maybeSingle(),
  ]);

  const city = cityRes.data;

  let countryName: string | null = null;
  if (city?.country_id) {
    const { data: country } = await supabase
      .from("destinations_countries")
      .select("name")
      .eq("id", city.country_id)
      .eq("locale", locale)
      .maybeSingle();
    countryName = country?.name ?? null;
  }

  return {
    ...activity,
    city_name: city?.name ?? null,
    country_name: countryName,
  };
}

export async function getSimilarTours(
  locale: Locale,
  destinationId: string | null,
  excludeSlug: string,
  limit = 3,
): Promise<DestinationActivity[]> {
  const supabase = await createClient();

  let query = supabase
    .from("destinations_activities")
    .select("*")
    .eq("locale", locale)
    .eq("is_active", true)
    .neq("slug", excludeSlug)
    .limit(limit);

  if (destinationId) {
    query = query.eq("destination_id", destinationId);
  }

  const { data, error } = await query;
  if (error || !data?.length) return [];
  return data;
}

export async function getHomeFeaturedTours(
  locale: Locale,
  limit = 4,
): Promise<DestinationActivity[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations_activities")
    .select("*")
    .eq("locale", locale)
    .eq("is_active", true)
    .eq("home_featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error || !data?.length) {
    console.error("Error fetching home featured tours:", error);
    return [];
  }

  return data;
}