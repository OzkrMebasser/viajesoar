import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/types/locale";
import type { Package, PackageDetail } from "@/types/packages";

const PAGE_SIZE = 9;

/* ======================================================
   🔥 GET PAGINATED PACKAGES (Listing page)
====================================================== */
export async function getPackages(locale: Locale, page: number = 1) {
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
      home_carousel_images,
      duration,
      price_from,
      taxes,
      currency,
      visited_cities,
      visited_countries,
      internal_pkg_id,
      days,
      nights
    `,
      { count: "exact" }
    )
    .eq("locale", locale)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching packages:", error);
    return emptyPagination(page);
  }

  if (!pkgs?.length) return emptyPagination(page);

  const formatted = await hydrateLocations<Package>(pkgs);

  return {
    packages: formatted,
    page,
    total: count ?? 0,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
  };
}

/* ======================================================
   🚀 GET HOME PACKAGES (Optimizado)
====================================================== */
export async function getHomePackages(locale: Locale) {
  const supabase = await createClient();

  const { data: pkgs, error } = await supabase
    .from("packages")
    .select(`
      id,
      slug,
      name,
      description,
      home_carousel_images,
      duration,
      price_from,
      taxes,
      currency,
      visited_cities,
      visited_countries,
      internal_pkg_id,
      days,
      nights
    `)
    .eq("locale", locale)
    .eq("is_active", true)
    .eq("is_home_carousel", true)
    .order("created_at", { ascending: false })
    .limit(7);

  if (error) {
    console.error("Error fetching home packages:", error);
    return [];
  }

  if (!pkgs?.length) return [];

  return await hydrateLocations<Package>(pkgs);
}

/* ======================================================
   🔍 GET PACKAGE BY SLUG (Detail page)
====================================================== */
export async function getPackageBySlug(
  slug: string,
  locale: Locale
): Promise<PackageDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;

  const [hydrated] = await hydrateLocations<PackageDetail>([data]);
  return hydrated ?? null;
}

/* ======================================================
   🧠 HYDRATE LOCATIONS (Reusable — genérico)
====================================================== */
async function hydrateLocations<T extends Package>(
  rawPkgs: any[]
): Promise<T[]> {
  const supabase = await createClient();

  const cityIds = [
    ...new Set(rawPkgs.flatMap((p) => p.visited_cities ?? [])),
  ];
  const countryIds = [
    ...new Set(rawPkgs.flatMap((p) => p.visited_countries ?? [])),
  ];

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

  return rawPkgs.map((pkg) => ({
    ...pkg,
    visited_cities: (pkg.visited_cities ?? []).map((id: string) =>
      cities?.find((c) => c.id === id) ?? { id, name: "N/A", slug: "" }
    ),
    visited_countries: (pkg.visited_countries ?? []).map((id: string) =>
      countries?.find((c) => c.id === id) ?? { id, name: "N/A", slug: "" }
    ),
  })) as T[];
}

/* ======================================================
   🧼 EMPTY PAGINATION HELPER
====================================================== */
function emptyPagination(page: number) {
  return {
    packages: [],
    page,
    total: 0,
    pageSize: PAGE_SIZE,
    totalPages: 0,
  };
}