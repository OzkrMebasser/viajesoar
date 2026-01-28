// src/lib/hooks/usePackageBySlug.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Package {
  id: string;
  locale: string;
  name: string;
  slug: string;
  description: string;
  visited_cities: { id: string; name: string; slug: string }[];
  visited_countries: { id: string; name: string; slug: string }[];
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
        
        // 1️⃣ Traer el paquete
        const { data: pkgData, error: pkgError } = await supabase
          .from("packages")
          .select("*")
          .eq("slug", slug)
          .eq("locale", locale)
          .eq("is_active", true)
          .single();

        if (pkgError) throw pkgError;
        if (!pkgData) {
          setPkg(null);
          return;
        }

        // 2️⃣ Traer ciudades
        const cityIds = pkgData.visited_cities || [];
        const { data: cities } = await supabase
          .from("destinations")
          .select("id, name, slug")
          .in("id", cityIds);

        // 3️⃣ Traer países
        const countryIds = pkgData.visited_countries || [];
        const { data: countries } = await supabase
          .from("destinations_countries")
          .select("id, name, slug")
          .in("id", countryIds);

        // 4️⃣ Combinar todo
        const formatted = {
          ...pkgData,
          visited_cities: cityIds.map(
            (id: string) => cities?.find(c => c.id === id) || { id, name: "N/A", slug: "" }
          ),
          visited_countries: countryIds.map(
            (id: string) => countries?.find(c => c.id === id) || { id, name: "N/A", slug: "" }
          ),
        };

        setPkg(formatted);
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