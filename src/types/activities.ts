import type { Locale } from "@/types/locale";

/* ============================
   OPTIONAL ACTIVITY IN PACKAGES
   ============================ */

export interface OptionalActivity {
  id: string;
  name: string;
  slug: string;
  locale: Locale;
  description: string;
  description_sections: { subtitle: string; description: string }[] | null;
  notes: string;

  // Precio
  price: number | null;
  price_from: number | null;
  price_to: number | null;
  currency: string | null;

  // Media
  cover_image: string | null;
  photos: string[];

  // Info del tab
  category: string;
  duration: string | null;
  recommended_time: string | null;
  difficulty_level: string | null;
  activity_mode: string | null;
  activity_type: string | null;

  // Incluidos
  included: string[] | null;
  not_included: string[] | null;

  // Ubicación
  address: string | null;

  // Tags
  tags: string[] | null; // ← AGREGAR

  // Flags
  is_featured: boolean | null;
  is_recommended: boolean | null;
}
/* ============================
   ACTIVITY BY DESTINATION
   ============================ */

export interface DestinationActivity {
  id: string;

  destination_id: string;
  locale: Locale;
  name: string;
  description: string;
  description_sections: { subtitle: string; description: string }[] | null; // ← AGREGAR

  notes: string;
  slug: string;
  category: string;

  price: number | null;
  price_from: number | null;
  price_to: number | null;
  currency: string | null;

  photos: string[];
  cover_image: string | null;

  latitude: number | null;
  longitude: number | null;
  address: string | null;

  duration: string | null;
  recommended_time: string | null;
  difficulty_level: string | null;

  schedule: string | null;
  available_days: string[] | null;

  included: string[] | null;
  not_included: string[] | null;

  official_website: string | null;
  booking_url: string | null;

  activity_mode: string | null;
  activity_type: string | null;

  tags: string[] | null;

  is_active: boolean;
  is_recommended: boolean | null;
  is_featured: boolean | null;
  home_featured: boolean | null;
  sort_order: number | null;

  source: string | null;

  provider_internal: string | null;
  provider_id: string | null;
  provider_activity_id: string | null;
  provider_type: string | null;
  provider_ui: string | null;

  created_at: string;
  updated_at: string | null;
}

// ─── BASE TYPE PARA LOS CARDS (campos usados por Desktop/MobileCardActivity) ─
export interface ActivityCardData {
  id: string;
  name: string;
  description: string;
  description_sections: { subtitle: string; description: string }[] | null;
  notes: string | null;
  href?: string | null;

  price: number | null;
  currency: string | null;

  cover_image: string | null;
  photos: string[] | null;

  category: string | null;
  duration: string | null;
  recommended_time: string | null;
  difficulty_level: string | null;
  activity_mode: string | null;

  included: string[] | null;
  not_included: string[] | null;

  is_featured: boolean | null;
}

export type Difficulty = "easy" | "moderate" | "hard";
export type ActivityMode = "group" | "private" | "semiPrivate" | "selfGuided";
export interface DestinationActivityWithLocation extends DestinationActivity {
  city_name: string | null;
  country_name: string | null;
}
