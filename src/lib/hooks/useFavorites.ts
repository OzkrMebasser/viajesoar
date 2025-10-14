"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

export function useFavorites() {
  const [userId, setUserId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoritesData, setFavoritesData] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref para evitar fetches múltiples
  const isFetchingRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  // 🔹 Obtener usuario autenticado - SOLO UNA VEZ
  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted && data.user?.id) {
        userIdRef.current = data.user.id;
        setUserId(data.user.id);
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (mounted) {
        if (session?.user?.id) {
          userIdRef.current = session.user.id;
          setUserId(session.user.id);
        } else {
          userIdRef.current = null;
          setUserId(null);
          setFavoritesData([]);
          setFavorites(new Set());
        }
      }
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  // 🔹 Cargar favoritos desde Supabase - SEPARADO
  useEffect(() => {
    if (!userId || isFetchingRef.current) return;

    const fetchFavorites = async () => {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const { data, error: queryError } = await supabase
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

        if (queryError) throw queryError;

        const destIds = new Set(
          data?.map((f: any) => String(f.destination_id)) || []
        );
        setFavorites(destIds);

        setFavoritesData(
          (data || []).map((f: any) => ({
            id: String(f.id),
            destination_id: String(f.destination_id),
            destinations: Array.isArray(f.destinations)
              ? f.destinations[0]
              : f.destinations,
          }))
        );
      } catch (err: any) {
        console.error("Error fetching favorites:", err.message);
        setError("Error al cargar los favoritos");
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchFavorites();
  }, [userId]);

  // 🔹 Alternar favorito (agregar / eliminar)
  const toggleFavorite = useCallback(
    async (destinationId: string) => {
      if (!userId) return;
      const isFavorite = favorites.has(destinationId);

      try {
        if (isFavorite) {
          await removeFavorite(destinationId);
        } else {
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

          setFavorites((prev) => new Set(prev).add(destinationId));
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
        }
      } catch (err: any) {
        console.error("Error toggling favorite:", err.message);
      }
    },
    [userId, favorites]
  );

  // 🔹 Eliminar favorito directamente
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
      }
    },
    [userId]
  );

  return {
    userId,
    favorites,
    favoritesData,
    toggleFavorite,
    removeFavorite,
    loading,
    error,
  };
}