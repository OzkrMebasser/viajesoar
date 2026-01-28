"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface Package {
  id: string;
  locale: string;
  name: string;
  slug: string;
  description: string;
  price_from: number;
  currency: string;
  images: string[];
  visited_cities?: { id: string; name: string; slug: string }[];
  visited_countries?: { id: string; name: string; slug: string }[];
}

export function usePackages(locale: "es" | "en") {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPackages() {
      try {
        setLoading(true);

        // 1️⃣ Traemos paquetes
        const { data: pkgs, error: pkgError } = await supabase
          .from("packages")
          .select("*")
          .eq("locale", locale)
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (pkgError) throw pkgError;
        if (!pkgs || !pkgs.length) {
          setPackages([]);
          return;
        }

        // 2️⃣ Sacamos IDs de ciudades y países
        const cityIds = pkgs.flatMap((p: any) => p.visited_cities || []);
        const countryIds = pkgs.flatMap((p: any) => p.visited_countries || []);

        // 3️⃣ Traemos info de ciudades
        const { data: cities } = await supabase
          .from("destinations")
          .select("id, name, slug")
          .in("id", cityIds);

        // 4️⃣ Traemos info de países
        const { data: countries } = await supabase
          .from("destinations_countries")
          .select("id, name, slug")
          .in("id", countryIds);

        // 5️⃣ Combinamos con los paquetes
        const formatted = pkgs.map((pkg: any) => ({
          ...pkg,
          visited_cities: (pkg.visited_cities || []).map(
            (id: string) => cities?.find(c => c.id === id) || { id, name: "N/A", slug: "" }
          ),
          visited_countries: (pkg.visited_countries || []).map(
            (id: string) => countries?.find(c => c.id === id) || { id, name: "N/A", slug: "" }
          ),
        }));

        setPackages(formatted);
      } catch (err: any) {
        console.error("Error fetching packages:", err);
        setError(err.message || "Error loading packages");
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, [locale]);

  return { packages, loading, error };
}
