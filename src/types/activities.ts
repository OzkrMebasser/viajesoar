import type { Locale } from "./locale";

/* ============================
   DB ROW
   ============================ */
export interface ActivityRow {
  id: string;
  locale: Locale;
  name: string;
  slug: string;
  description: string;
  category: "tour" | "free-activity";
  price: number | null;
  photos: string[];
  destination_id: string;
  is_active: boolean;
}

/* ============================
   DOMAIN MODEL
   ============================ */
export interface Activity {
  id: string;
  locale: Locale;
  name: string;
  slug: string;
  description: string;
  category: "tour" | "free-activity";
  price: number | null;
  photos: string[];
  destinationId: string;
}
