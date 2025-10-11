import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// ============================================
// TIPOS
// ============================================

export interface DestinationRegion {
  id: number;
  name: string;
  description: string;
  image: string;
  gradient: string;
  icon: string;
  locale: string;
  is_active: boolean;
  order_index?: number;
  slug: string;
}

export interface Destination {
  id: string;
  locale: string;
  name: string;
  country: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  duration: string;
  description: string;
  category: string;
  slug: string;
  highlights: string[];
  is_featured: boolean;
  is_active: boolean;
}
// ============================================
// HOOK PARA DESTINOS DE REGIONES HOME (Slider)
// ============================================

export function useDestinationRegions(locale: "es" | "en" = "es") {
  const [regions, setRegions] = useState<DestinationRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRegions() {
      try {
        setLoading(true);

        const { data, error } = await supabase
         
          .from("destinations_regions")
          .select("*")
          .eq("locale", locale)
          .eq("is_active", true)
          .order("order_index", { ascending: true });

          console.log("Regions...", data)

        if (error) throw error;

        setRegions(data || []);
      } catch (err) {
        console.error("Error fetching regions:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    fetchRegions();
  }, [locale]);

  return { regions, loading, error };
}

// ============================================
// HOOK PARA URL POR NOMBRE
// ============================================

export function useDestinationBySlug(slug: string, locale: string) {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestination() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("destinations_regions")
          .select("*")
          .eq("slug", slug)
          .eq("locale", locale)
          .limit(1);

        if (error) throw error;

        setDestination(data?.[0] || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchDestination();
  }, [slug, locale]);

  return { destination, loading, error };
}

export function useDestinationByName(name: string, locale: string) {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestination() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("destinations_regions")
          .select("*")
          .eq("slug", name)
          .eq("locale", locale)
          .single();

        if (error) throw error;
        setDestination(data || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (name) fetchDestination();
  }, [name, locale]);

  return { destination, loading, error };
}

// ============================================
// HOOK PARA DESTINOS DETALLADOS - FIXED
// ============================================

// lib/hooks/useDestinations.ts

export const useDestinations = (locale: "es" | "en" = "es") => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("destinations")
          .select("*")
          .eq("locale", locale)
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (error) throw error;

        if (data) {
          const formatted = data.map((d: any) => ({
            ...d,
            highlights: [d.highlight_1, d.highlight_2, d.highlight_3].filter(Boolean),
          }));
          setDestinations(formatted);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error fetching destinations");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [locale]);

  return { destinations, loading, error };
};


// ============================================
// CRUD Y FUNCIONES AUXILIARES
// ============================================

export async function createRegion(
  region: Omit<DestinationRegion, "id"> & { orderIndex: number }
) {
  const { data, error } = await supabase
    .from("destinations_regions")
    .insert([
      {
        name_es: region.name,
        name_en: region.name,
        icon: region.icon,
        image: region.image,
        gradient: region.gradient,
        description_es: region.description,
        description_en: region.description,
        order_index: region.orderIndex,
      },
    ])
    .select();

  if (error) throw error;
  return data;
}

export async function createDestination(
  destination: Omit<Destination, "id">,
  categorySlug: string
) {
  const { data: category } = await supabase
    .from("destination_categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) throw new Error("Categoría no encontrada");

  const { data: newDest, error: destError } = await supabase
    .from("destinations")
    .insert([
      {
        name_es: destination.name,
        name_en: destination.name,
        country_es: destination.country,
        country_en: destination.country,
        image: destination.image,
        price: destination.price,
        rating: destination.rating,
        reviews: destination.reviews,
        duration_es: destination.duration,
        duration_en: destination.duration,
        description_es: destination.description,
        description_en: destination.description,
        category_id: category.id,
      },
    ])
    .select()
    .single();

  if (destError) throw destError;

  if (destination.highlights.length > 0) {
    const highlightsToInsert = destination.highlights.map(
      (highlight, index) => ({
        destination_id: newDest.id,
        highlight_es: highlight,
        highlight_en: highlight,
        order_index: index + 1,
      })
    );

    const { error: highlightsError } = await supabase
      .from("destination_highlights")
      .insert(highlightsToInsert);

    if (highlightsError) throw highlightsError;
  }

  return newDest;
}

export async function updateDestination(
  id: string,
  updates: Partial<Destination>
) {
  const { data, error } = await supabase
    .from("destinations")
    .update({
      name_es: updates.name,
      name_en: updates.name,
      country_es: updates.country,
      country_en: updates.country,
      image: updates.image,
      price: updates.price,
      rating: updates.rating,
      reviews: updates.reviews,
      duration_es: updates.duration,
      duration_en: updates.duration,
      description_es: updates.description,
      description_en: updates.description,
    })
    .eq("id", id)
    .select();

  if (error) throw error;

  if (updates.highlights) {
    await supabase
      .from("destination_highlights")
      .delete()
      .eq("destination_id", id);

    const highlightsToInsert = updates.highlights.map((highlight, index) => ({
      destination_id: id,
      highlight_es: highlight,
      highlight_en: highlight,
      order_index: index + 1,
    }));

    await supabase.from("destination_highlights").insert(highlightsToInsert);
  }

  return data;
}

export async function deleteDestination(id: string) {
  const { error } = await supabase
    .from("destinations")
    .update({ is_active: false })
    .eq("id", id);

  if (error) throw error;
}

// ============================================
// FUNCIONES DE BÚSQUEDA Y FILTRADO
// ============================================
export async function searchDestinations(
  query: string,
  lang: "es" | "en" = "es"
) {
  const nameField = lang === "es" ? "name_es" : "name_en";
  const countryField = lang === "es" ? "country_es" : "country_en";
  const descriptionField = lang === "es" ? "description_es" : "description_en";

  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .or(
      `${nameField}.ilike.%${query}%,${countryField}.ilike.%${query}%,${descriptionField}.ilike.%${query}%`
    )
    .eq("is_active", true);

  if (error) throw error;
  return data;
}

export async function getDestinationsByCategory(
  categorySlug: string,
  lang: "es" | "en" = "es"
) {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("is_active", true);

  if (error) throw error;
  
  // Filtrar localmente si la categoría no es un join en BD
  return data;
}

export async function getDestinationsByPriceRange(min: number, max: number) {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .gte("price", min)
    .lte("price", max)
    .eq("is_active", true);

  if (error) throw error;
  return data;
}