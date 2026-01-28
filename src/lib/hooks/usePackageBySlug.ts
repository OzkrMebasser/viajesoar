import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Package {
  id: string;
  locale: string;
  name: string;
  slug: string;
  description: string;
  visited_cities: string[];
  visited_countries: string[];
  optional_activities: string[];
  images: string[];
  duration: string;
  price_from: number;
  currency: string;
  region_id: string;
  is_active: boolean;
  is_featured: boolean;
}

export function usePackageBySlug(slug: string, locale: "es" | "en") {
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchPackage() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("packages")
          .select("*")
          .eq("slug", slug)
          .eq("locale", locale)
          .eq("is_active", true)
          .single();

        if (error) throw error;

        setPkg(data);
      } catch (err: any) {
        setError(err.message || "Error fetching package");
        setPkg(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPackage();
  }, [slug, locale]);

  return { pkg, loading, error };
}
