// lib/hooks/useDestinations.ts
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
  icon: string; // ← el nombre del ícono (ej: "GiPalmTree")
  locale: string;
  is_active: boolean;
  order_index?: number;
  slug: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  duration: string;
  highlights: string[];
  description: string;
  category: "beach" | "city" | "nature" | "culture" | "adventure";
}

// ============================================
// HOOK PARA DESTINOS DE REGIONES (Slider)
// ============================================
// export function useDestinationRegions(lang: 'es' | 'en' = 'es') {
//   const [regions, setRegions] = useState<DestinationRegion[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchRegions() {
//       try {
//         setLoading(true);
//         const { data, error } = await supabase
//           .from('destinations_regions')
//           .select('*')
//           .eq('is_active', true)
//           .order('order_index', { ascending: true });

//         if (error) throw error;

//         const mappedRegions: DestinationRegion[] = data.map((region: any) => ({
//           name: lang === 'es' ? region.name_es : region.name_en,
//           icon: region.icon,
//           image: region.image,
//           gradient: region.gradient,
//           description: lang === 'es' ? region.description_es : region.description_en,
//         }));

//         setRegions(mappedRegions);
//       } catch (err) {
//         console.error('Error fetching regions:', err);
//         setError(err instanceof Error ? err.message : 'Error desconocido');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchRegions();
//   }, [lang]); // 👈 importante: lang en dependencias para cambiar idioma

//   return { regions, loading, error };
// }

// interface DestinationRegion {
//   id: number;
//   name: string;
//   description: string;
//   image: string;
//   gradient: string;
//   icon: string; // ← el nombre del ícono (ej: "GiPalmTree")
//   locale: string;
//   is_active: boolean;
//   order_index?: number;
// }

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
          .eq("is_active", true)
          .eq("locale", locale)
          .order("order_index", { ascending: true });

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
          .single(); // Devuelve solo uno

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
          .limit(1); // evita error de multiple rows

        if (error) throw error;

        setDestination(data?.[0] || null); // toma el primer registro si existe
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

// ============================================
// HOOK PARA DESTINOS DETALLADOS
// ============================================
export function useDestinations(lang: "es" | "en" = "es") {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        setLoading(true);

        const { data: destinationsData, error: destError } = await supabase
          .from("destinations")
          .select(
            `
            *,
            category:destination_categories(slug)
          `
          )
          .eq("is_active", true);

        if (destError) throw destError;

        const destinationsWithHighlights = await Promise.all(
          destinationsData.map(async (dest: any) => {
            const { data: highlights } = await supabase
              .from("destination_highlights")
              .select("*")
              .eq("destination_id", dest.id)
              .order("order_index", { ascending: true });

            return {
              id: dest.id,
              name: lang === "es" ? dest.name_es : dest.name_en,
              country: lang === "es" ? dest.country_es : dest.country_en,
              image: dest.image,
              price: parseFloat(dest.price),
              rating: parseFloat(dest.rating),
              reviews: dest.reviews,
              duration: lang === "es" ? dest.duration_es : dest.duration_en,
              description:
                lang === "es" ? dest.description_es : dest.description_en,
              category: dest.category?.slug || "culture",
              highlights:
                highlights?.map((h: any) =>
                  lang === "es" ? h.highlight_es : h.highlight_en
                ) || [],
            };
          })
        );

        setDestinations(destinationsWithHighlights);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();
  }, [lang]); // 👈 importante: lang en dependencias para cambiar idioma

  return { destinations, loading, error };
}

// ============================================
// CRUD Y FUNCIONES AUXILIARES
// ============================================

// Para admin: crear región con soporte idioma
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
    .select(`*, category:destination_categories!inner(slug)`)
    .eq("category.slug", categorySlug)
    .eq("is_active", true);

  if (error) throw error;
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
