import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/locale";
import type { SlideshowDestination } from "@/types/heroDestinations";

export async function getHeroDestinations(
  locale: Locale,
): Promise<SlideshowDestination[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("travel_slideshow_destinations")
    .select("*")
    .eq("is_active", true)
    .eq("locale", locale)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching hero destinations:", error);
    return [];
  }

  return (
    data?.map((dest) => ({
      id: dest.id,
      place: dest.place,
      country: dest.country,
      title: dest.title,
      title2: dest.title2,
      description: dest.description,
      image: dest.image,
      orderIndex: dest.order_index,
    })) ?? []
  );
}
