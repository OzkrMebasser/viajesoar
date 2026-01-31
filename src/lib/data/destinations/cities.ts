import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/locale";
import type { Destination } from "@/types/destinations";
import type { PaginatedResult } from "@/types/pagination";

const PAGE_SIZE = 9;

/* =====================================================
   CIUDAD / DESTINO INDIVIDUAL
   ===================================================== */
export async function getCityBySlug(
  slug: string,
  locale: Locale
): Promise<Destination | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    console.error("Error fetching city:", error);
    return null;
  }

  return {
    ...data,
    highlights: [
      data.highlight_1,
      data.highlight_2,
      data.highlight_3,
    ].filter(Boolean),
  };
}

/* =====================================================
   LISTADO PAGINADO DE DESTINOS / CIUDADES
   ===================================================== */
export async function getDestinationsPaginated(
  locale: Locale,
  page = 1
): Promise<PaginatedResult<Destination>> {
  const supabase = await createClient();

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from("destinations")
    .select("*", { count: "exact" })
    .eq("locale", locale)
    .eq("is_active", true)
    .order("name", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching destinations:", error);
    return {
      data: [],
      page,
      pageSize: PAGE_SIZE,
      total: 0,
      totalPages: 0,
    };
  }

  const formatted =
    data?.map(d => ({
      ...d,
      highlights: [
        d.highlight_1,
        d.highlight_2,
        d.highlight_3,
      ].filter(Boolean),
    })) ?? [];

  return {
    data: formatted,
    page,
    pageSize: PAGE_SIZE,
    total: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
  };
}
