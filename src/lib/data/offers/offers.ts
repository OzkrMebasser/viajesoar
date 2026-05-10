import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/locale";
import type { Offer } from "@/types/offers";
import type { PaginatedResult } from "@/types/pagination";

const PAGE_SIZE = 9;

export async function getOffers(
  locale: Locale,
  page = 1,
): Promise<PaginatedResult<Offer>> {
  const supabase = await createClient();

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from("offers")
    .select(`
      *,
      package:package_id ( slug )
    `, { count: "exact" })
    .eq("locale", locale)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching offers:", error);
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

export async function getFeaturedOffers(locale: Locale, limit = 3): Promise<Offer[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("offers")
    .select(`
      *,
      package:package_id ( slug )
    `)
    .eq("locale", locale)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured offers:", error);
    return [];
  }

  return data ?? [];
}