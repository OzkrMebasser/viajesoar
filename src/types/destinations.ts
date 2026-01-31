import type { Locale } from "./locale";

/* ============================
   DB ROW (Supabase)
   ============================ */
export interface DestinationRow {
  id: string;
  locale: Locale;
  name: string;
  country: string;
  image: string;
  price: number;
  rating: number | null;
  reviews: number;
  duration: string;
  description: string;
  category: string;
  slug: string;

  highlight_1?: string | null;
  highlight_2?: string | null;
  highlight_3?: string | null;

  country_id: string;
  is_featured: boolean;
  is_active: boolean;
}

/* ============================
   DOMAIN MODEL (App)
   ============================ */
export interface Destination {
  id: string;
  locale: Locale;
  name: string;
  country: string;
  image: string;
  price: number;
  rating: number | null;
  reviews: number;
  duration: string;
  description: string;
  category: string;
  slug: string;

  highlights: string[];

  country_id: string;
  is_featured: boolean;
}
