"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface Favorite {
  id: string;
  destination_id: string;
  destinations: {
    id: string;
    name: string;
    country: string;
    image: string;
    price: number;
    rating: number;
    reviews?: number;
    duration?: string;
    description?: string;
    is_featured?: boolean;
  };
}

interface FavoritesContextType {
  userId: string | null;
  favorites: Set<string>;
  favoritesData: Favorite[];
  loading: boolean;
  error: string | null;
  toggleFavorite: (destinationId: string) => Promise<void>;
  removeFavorite: (destinationId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoritesData, setFavoritesData] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener usuario
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id || null);
      if (!session?.user?.id) {
        setFavorites(new Set());
        setFavoritesData([]);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Cargar favoritos
  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("favorites")
        .select(`
          id,
          destination_id,
          destinations (
            id,
            name,
            country,
            image,
            price,
            rating,
            reviews,
            duration,
            description,
            is_featured
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const destIds = new Set(data?.map((f: any) => String(f.destination_id)) || []);
      setFavorites(destIds);

      setFavoritesData(
        (data || []).map((f: any) => ({
          id: String(f.id),
          destination_id: String(f.destination_id),
          destinations: Array.isArray(f.destinations) ? f.destinations[0] : f.destinations,
        }))
      );
    } catch (err: any) {
      console.error("Error fetching favorites:", err.message);
      setError("Error al cargar los favoritos");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);


// =============================
// Primero: removeFavorite
// =============================
const removeFavorite = useCallback(
  async (destinationId: string) => {
    if (!userId) return;

    try {
      const { error: deleteError } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("destination_id", destinationId);

      if (deleteError) throw deleteError;

      setFavorites((prev) => {
        const copy = new Set(prev);
        copy.delete(destinationId);
        return copy;
      });

      setFavoritesData((prev) =>
        prev.filter((fav) => String(fav.destination_id) !== destinationId)
      );
    } catch (err: any) {
      console.error("Error removing favorite:", err.message);
      await fetchFavorites(); // sincronizar en caso de error
    }
  },
  [userId, fetchFavorites]
);

// =============================
// Después: toggleFavorite
// =============================
const toggleFavorite = useCallback(
  async (destinationId: string) => {
    if (!userId) return;

    try {
      const { data: existing } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("destination_id", destinationId)
        .maybeSingle();

      if (existing) {
        await removeFavorite(destinationId);
        return;
      }

      const { data, error: insertError } = await supabase
        .from("favorites")
        .insert({ user_id: userId, destination_id: destinationId })
        .select(`
          id,
          destination_id,
          destinations (
            id,
            name,
            country,
            image,
            price,
            rating,
            reviews,
            duration,
            description,
            is_featured
          )
        `)
        .single();

      if (insertError) throw insertError;

      setFavorites((prev) => new Set([...prev, destinationId]));
      if (data) {
        setFavoritesData((prev) => [
          {
            id: String(data.id),
            destination_id: String(data.destination_id),
            destinations: Array.isArray(data.destinations)
              ? data.destinations[0]
              : data.destinations,
          },
          ...prev,
        ]);
      }
    } catch (err: any) {
      console.error("Error toggling favorite:", err.message);
      await fetchFavorites();
    }
  },
  [userId, fetchFavorites, removeFavorite]
);


  return (
    <FavoritesContext.Provider
      value={{ userId, favorites, favoritesData, loading, error, toggleFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook para consumir el contexto
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  }
  return context;
}
