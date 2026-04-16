import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/locale";
import type { Offer } from "@/types/offers";

export async function getOffers(locale: Locale): Promise<Offer[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("offers")
    .select(`
      *,
      package:package_id ( slug )
    `)
    .eq("locale", locale)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching offers:", error);
    return [];
  }

  return data ?? [];
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