import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/locale";
import type { Package, LocationRef } from "@/types/packages";


const PAGE_SIZE = 9;

export async function getPackages(
  locale: Locale,
  page: number = 1
) {
  const supabase = await createClient();

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: pkgs, error, count } = await supabase
    .from("packages")
    .select(
      `
      id,
      slug,
      name,
      description,
      images,
      duration,
      price_from,
      currency,
      visited_cities,
      visited_countries
    `,
      { count: "exact" }
    )
    .eq("locale", locale)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to);

    // console.log("data from pkgs:", pkgs);

  if (error) {
  console.error("Error fetching packages:", error);
  
  return {
    packages: [],
    page,
    total: 0,
    pageSize: PAGE_SIZE,
    totalPages: 0,
  };
}


  const cityIds = pkgs?.flatMap(p => p.visited_cities ?? []) ?? [];
  const countryIds = pkgs?.flatMap(p => p.visited_countries ?? []) ?? [];

  const [{ data: cities }, { data: countries }] = await Promise.all([
    cityIds.length
      ? supabase
          .from("destinations")
          .select("id, name, slug")
          .in("id", cityIds)
      : Promise.resolve({ data: [] }),
    countryIds.length
      ? supabase
          .from("destinations_countries")
          .select("id, name, slug")
          .in("id", countryIds)
      : Promise.resolve({ data: [] }),
  ]);

  const formatted: Package[] =
    pkgs?.map(pkg => ({
      ...pkg,
      visited_cities: (pkg.visited_cities ?? []).map(
        (id: string) =>
          cities?.find(c => c.id === id) ?? {
            id,
            name: "N/A",
            slug: "",
          }
      ),
      visited_countries: (pkg.visited_countries ?? []).map(
        (id: string) =>
          countries?.find(c => c.id === id) ?? {
            id,
            name: "N/A",
            slug: "",
          }
      ),
    })) ?? [];

  return {
    packages: formatted,
    page,
    total: count ?? 0,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
  };
}
