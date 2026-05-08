"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export type EntityType = "destination" | "package" | "activity" | "blog_post";

interface EntityData {
  name?: string;
  image?: string;
  price?: number;
  rating?: number;
}

interface Favorite {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  entityData?: EntityData | null;
}

interface FavoritesContextType {
  userId: string | null;
  favorites: Map<EntityType, Set<string>>;
  favoritesData: Favorite[];
  loading: boolean;
  error: string | null;
  toggleFavorite: (entityType: EntityType, entityId: string) => Promise<void>;
  removeFavorite: (entityType: EntityType, entityId: string) => Promise<void>;
  isFavorite: (entityType: EntityType, entityId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const TABLE_CONFIG: Record<string, {
  table: string;
  imageField: string;
  nameField?: string;
  priceField?: string;
}> = {
  destination: { table: "destinations_countries",  imageField: "images" },
  package:     { table: "packages",                imageField: "images",      priceField: "price_from" },
  activity:    { table: "destinations_activities", imageField: "cover_image", priceField: "price_from" },
  blog_post:   { table: "blog_posts",              imageField: "cover_image", nameField: "title" },
};

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Map<EntityType, Set<string>>>(new Map());
  const [favoritesData, setFavoritesData] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id || null);
      if (!session?.user?.id) {
        setFavorites(new Map());
        setFavoritesData([]);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("favorites")
        .select("id, entity_type, entity_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const byType: Record<string, string[]> = {};
      (data || []).forEach((f: any) => {
        if (!byType[f.entity_type]) byType[f.entity_type] = [];
        byType[f.entity_type].push(String(f.entity_id));
      });

      const entityMap: Record<string, EntityData> = {};
      await Promise.all(
        Object.entries(byType).map(async ([type, ids]) => {
          const config = TABLE_CONFIG[type];
          if (!config) return;

          const nameField = config.nameField ?? "name";
          const selectFields = ["id", nameField, config.imageField];
          if (config.priceField) selectFields.push(config.priceField);

          const { data: rows, error: rowsError } = await supabase
            .from(config.table)
            .select(selectFields.join(", "))
            .in("id", ids);

          if (rowsError) {
            console.error(`Error fetching ${config.table}:`, rowsError.message);
            return;
          }

          (rows || []).forEach((row: any) => {
            const imageValue = row[config.imageField];
            entityMap[`${type}:${row.id}`] = {
              name: row[nameField],
              image: Array.isArray(imageValue) ? imageValue[0] : imageValue,
              price: config.priceField ? row[config.priceField] : undefined,
              rating: undefined,
            };
          });
        })
      );

      const map = new Map<EntityType, Set<string>>();
      (data || []).forEach((f: any) => {
        if (!map.has(f.entity_type)) map.set(f.entity_type, new Set());
        map.get(f.entity_type)!.add(String(f.entity_id));
      });

      setFavorites(map);
      setFavoritesData(
        (data || []).map((f: any) => ({
          id: String(f.id),
          entity_type: f.entity_type as EntityType,
          entity_id: String(f.entity_id),
          entityData: entityMap[`${f.entity_type}:${f.entity_id}`] || null,
        }))
      );
    } catch (err: any) {
      console.error("Error fetching favorites:", err.message);
      setError("Error al cargar los favoritos");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const isFavorite = useCallback(
    (entityType: EntityType, entityId: string) =>
      favorites.get(entityType)?.has(entityId) ?? false,
    [favorites]
  );

  const removeFavorite = useCallback(
    async (entityType: EntityType, entityId: string) => {
      if (!userId) return;
      try {
        const { error: deleteError } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("entity_type", entityType)
          .eq("entity_id", entityId);
        if (deleteError) throw deleteError;

        setFavorites((prev) => {
          const copy = new Map(prev);
          copy.get(entityType)?.delete(entityId);
          return copy;
        });
        setFavoritesData((prev) =>
          prev.filter((f) => !(f.entity_type === entityType && f.entity_id === entityId))
        );
      } catch (err: any) {
        console.error("Error removing favorite:", err.message);
        await fetchFavorites();
      }
    },
    [userId, fetchFavorites]
  );

  const toggleFavorite = useCallback(
    async (entityType: EntityType, entityId: string) => {
      if (!userId) return;
      try {
        const { data: existing } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", userId)
          .eq("entity_type", entityType)
          .eq("entity_id", entityId)
          .maybeSingle();

        if (existing) {
          await removeFavorite(entityType, entityId);
          return;
        }

        const { error: insertError } = await supabase
          .from("favorites")
          .insert({ user_id: userId, entity_type: entityType, entity_id: entityId });
        if (insertError) throw insertError;

        await fetchFavorites();
      } catch (err: any) {
        console.error("Error toggling favorite:", err.message);
        await fetchFavorites();
      }
    },
    [userId, fetchFavorites, removeFavorite]
  );

  return (
    <FavoritesContext.Provider
      value={{ userId, favorites, favoritesData, loading, error, toggleFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  return context;
}