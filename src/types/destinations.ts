/* =====================================================
   TIPOS (MODELOS DE DATOS)
   ===================================================== */

export interface DestinationRegion {
  id: string;
  name: string;
  description: string;
  image: string;
  gradient: string;
  icon: string;
  locale: string;
  is_active: boolean;
  order_index?: number;
  slug: string;
}

export interface DestinationCountry {
  id: string;
  locale: "es" | "en";
  name: string;
  slug: string;
  description: string;
  image: string;
  region_id: string;
  order_index: number;
  is_active: boolean;
  // created_at: string;

}

export interface Destination {
  id: string;
  locale: string;
  name: string;
  country: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  duration: string;
  description: string;
  category: string;
  slug: string;
  highlights: string[];
  country_id: string;
  is_featured: boolean;
  is_active: boolean;
}

