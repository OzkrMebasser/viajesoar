// lib/hooks/useSlideshowDestinations.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface SlideshowDestination {
  id?: string;
  place: string;
  country: string;
  title: string;
  title2: string;
  description: string;
  image: string;
  orderIndex?: number;
}

// ===============================
// HOOK PRINCIPAL
// ===============================
export function useSlideshowDestinations(lang: 'es' | 'en' = 'es') {
  const [destinations, setDestinations] = useState<SlideshowDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('travel_slideshow_destinations')
          .select('*')
          .eq('is_active', true)
          .eq('locale', lang)
          .order('order_index', { ascending: true });

        if (error) throw error;

        setDestinations(
          data.map((dest: any) => ({
            id: dest.id,
            place: dest.place,
            country: dest.country,
            title: dest.title,
            title2: dest.title2,
            description: dest.description,
            image: dest.image,
            orderIndex: dest.order_index,
          }))
        );
      } catch (err) {
        console.error('Error fetching slideshow destinations:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();
  }, [lang]);
  

  return { destinations, loading, error };
}

// ===============================
// FUNCIONES CRUD PARA ADMIN
// ===============================
// export async function createSlideshowDestination(destination: SlideshowDestination & { locale: 'es' | 'en', orderIndex: number }) {
//   const { data, error } = await supabase
//     .from('travel_slideshow_destinations')
//     .insert([{
//       locale: destination.locale,
//       place: destination.place,
//       country: destination.country,
//       title: destination.title,
//       title2: destination.title2,
//       description: destination.description,
//       image: destination.image,
//       order_index: destination.orderIndex,
//     }])
//     .select();

//   if (error) throw error;
//   return data;
// }

// export async function updateSlideshowDestination(id: string, updates: Partial<SlideshowDestination>) {
//   const { data, error } = await supabase
//     .from('travel_slideshow_destinations')
//     .update({
//       place: updates.place,
//       country: updates.country,
//       title: updates.title,
//       title2: updates.title2,
//       description: updates.description,
//       image: updates.image,
//       order_index: updates.orderIndex,
//     })
//     .eq('id', id)
//     .select();

//   if (error) throw error;
//   return data;
// }

// export async function deleteSlideshowDestination(id: string) {
//   const { error } = await supabase
//     .from('travel_slideshow_destinations')
//     .update({ is_active: false })
//     .eq('id', id);

//   if (error) throw error;
// }
