// src/types/search.ts
// ─── Fuente única del tipo SearchResult ──────────────────────────────────────
// Importar desde aquí en: route.ts, useSearch.ts, SearchOverlay.tsx

export type SearchCategory = "package" | "tour" | "destination" | "country";

export type SearchResult = {
  id: string;
  title: string;
  description: string;
  category: SearchCategory;
  slug: string;
  image?: string | null;
  price?: number | null;
  currency?: string | null;
};

export type SearchLocale = "es" | "en";

export const VALID_LOCALES: SearchLocale[] = ["es", "en"];

export function isValidLocale(value: string): value is SearchLocale {
  return VALID_LOCALES.includes(value as SearchLocale);
}