// lib/hooks/useDestinations.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// ============================================
// TIPOS - Coinciden con tu código actual
// ============================================

export interface DestinationRegion {
  name: string;
  icon: string; // Nombre del componente de icono como string
  image: string;
  gradient: string;
  description: string;
}

export interface Destination {
  id: number;
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

export function useDestinationRegions() {
  const [regions, setRegions] = useState<DestinationRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRegions() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('destinations_regions')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) throw error;

        // Mapear datos de Supabase al formato esperado
        const mappedRegions: DestinationRegion[] = data.map((region: any) => ({
          name: region.name,
          icon: region.icon, // Nombre del icono como string
          image: region.image,
          gradient: region.gradient,
          description: region.description,
        }));

        setRegions(mappedRegions);
      } catch (err) {
        console.error('Error fetching regions:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchRegions();
  }, []);

  return { regions, loading, error };
}

// ============================================
// HOOK PARA DESTINOS DETALLADOS
// ============================================

export function useDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        setLoading(true);
        
        // Obtener destinos con su categoría
        const { data: destinationsData, error: destError } = await supabase
          .from('destinations')
          .select(`
            *,
            category:destination_categories(slug)
          `)
          .eq('is_active', true);

        if (destError) throw destError;

        // Obtener highlights para cada destino
        const destinationsWithHighlights = await Promise.all(
          destinationsData.map(async (dest: any) => {
            const { data: highlights } = await supabase
              .from('destination_highlights')
              .select('highlight')
              .eq('destination_id', dest.id)
              .order('order_index', { ascending: true });

            return {
              id: parseInt(dest.id.substring(0, 8), 16), // Convertir UUID a número para compatibilidad
              name: dest.name,
              country: dest.country,
              image: dest.image,
              price: parseFloat(dest.price),
              rating: parseFloat(dest.rating),
              reviews: dest.reviews,
              duration: dest.duration,
              description: dest.description,
              category: dest.category?.slug || 'culture',
              highlights: highlights?.map((h: any) => h.highlight) || [],
            };
          })
        );

        setDestinations(destinationsWithHighlights);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();
  }, []);

  return { destinations, loading, error };
}

// ============================================
// FUNCIONES AUXILIARES PARA ADMIN
// ============================================

// Crear nueva región
export async function createRegion(region: Omit<DestinationRegion, 'id'> & { orderIndex: number }) {
  const { data, error } = await supabase
    .from('destinations_regions')
    .insert([
      {
        name: region.name,
        icon: region.icon,
        image: region.image,
        gradient: region.gradient,
        description: region.description,
        order_index: region.orderIndex,
      },
    ])
    .select();

  if (error) throw error;
  return data;
}

// Crear nuevo destino
export async function createDestination(
  destination: Omit<Destination, 'id'>,
  categorySlug: string
) {
  // Primero obtener el ID de la categoría
  const { data: category } = await supabase
    .from('destination_categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (!category) throw new Error('Categoría no encontrada');

  // Crear el destino
  const { data: newDest, error: destError } = await supabase
    .from('destinations')
    .insert([
      {
        name: destination.name,
        country: destination.country,
        image: destination.image,
        price: destination.price,
        rating: destination.rating,
        reviews: destination.reviews,
        duration: destination.duration,
        description: destination.description,
        category_id: category.id,
      },
    ])
    .select()
    .single();

  if (destError) throw destError;

  // Crear los highlights
  if (destination.highlights.length > 0) {
    const highlightsToInsert = destination.highlights.map((highlight, index) => ({
      destination_id: newDest.id,
      highlight,
      order_index: index + 1,
    }));

    const { error: highlightsError } = await supabase
      .from('destination_highlights')
      .insert(highlightsToInsert);

    if (highlightsError) throw highlightsError;
  }

  return newDest;
}

// Actualizar destino
export async function updateDestination(id: string, updates: Partial<Destination>) {
  const { data, error } = await supabase
    .from('destinations')
    .update({
      name: updates.name,
      country: updates.country,
      image: updates.image,
      price: updates.price,
      rating: updates.rating,
      reviews: updates.reviews,
      duration: updates.duration,
      description: updates.description,
    })
    .eq('id', id)
    .select();

  if (error) throw error;

  // Si hay highlights, actualizar también
  if (updates.highlights) {
    // Eliminar highlights existentes
    await supabase
      .from('destination_highlights')
      .delete()
      .eq('destination_id', id);

    // Insertar nuevos highlights
    const highlightsToInsert = updates.highlights.map((highlight, index) => ({
      destination_id: id,
      highlight,
      order_index: index + 1,
    }));

    await supabase
      .from('destination_highlights')
      .insert(highlightsToInsert);
  }

  return data;
}

// Eliminar destino (soft delete)
export async function deleteDestination(id: string) {
  const { error } = await supabase
    .from('destinations')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// FUNCIONES DE BÚSQUEDA Y FILTRADO
// ============================================

export async function searchDestinations(query: string) {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .or(`name.ilike.%${query}%,country.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('is_active', true);

  if (error) throw error;
  return data;
}

export async function getDestinationsByCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from('destinations')
    .select(`
      *,
      category:destination_categories!inner(slug)
    `)
    .eq('category.slug', categorySlug)
    .eq('is_active', true);

  if (error) throw error;
  return data;
}

export async function getDestinationsByPriceRange(min: number, max: number) {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .gte('price', min)
    .lte('price', max)
    .eq('is_active', true);

  if (error) throw error;
  return data;
}