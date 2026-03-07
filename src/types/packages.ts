export interface LocationRef {
  id: string;
  name: string;
  slug: string;
  country_code?: string;  
  latitude?: number | null;
  longitude?: number | null;
}
export interface RegionRef {
  id: string;
  name: string;
  icon?: string | null;
}

// ── Tipo ligero — listados y cards ──
export interface Package {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  home_carousel_images: string[];
  duration: string | null;
  price_from: number | null;
  taxes: number | null;
  currency: string;
  visited_cities: LocationRef[];
  visited_countries: LocationRef[];

  // Región (requerida en listing)
  region_id?: string | null;
  region?: RegionRef | null;
  // ── Campos opcionales — disponibles en listing y detail ──
  days?: number | null;
  nights?: number | null;
  includes_flight?: boolean | null;
  min_passengers?: number | null;
  internal_pkg_id?: string | null;
  provider_pkg_id?: string | null;


  // Notas - opcional en listados
  notes?: Note[] | null;

  
}

// Añade esto después de la interfaz Supplement o donde prefieras

export interface Note {
  type: string;      // "importantes", "tarifas", "hoteles"
  title: string;     // "NOTAS IMPORTANTES", "NOTAS DE LAS TARIFAS", etc.
  content: string;   // El contenido de la nota con saltos de línea
}

export interface Supplement {
  amount: number;
  dates: string[]; // "YYYY-MM-DD"
}

// ── Tipo completo — página de detalle ──
export interface PackageDetail extends Package {
  // Media
  images: string[];

  // Duration (requeridos en detail)
  days: number | null;
  nights: number | null;

  // Pricing
  price_single: number | null;
  price_triple: number | null;
  price_child: number | null;
  price_infant: number | null;
  taxes: number | null;
  deposit_amount: number | null;
  prices_valid_until: string | null;
  supplements?: Supplement[] | null;

  // Content
  itinerary: DayItinerary[] | null;
  hotels: HotelEntry[] | null;
  included: string[] | null;
  not_included: string[] | null;

  // Logistics (requeridos en detail)
  includes_flight: boolean | null;
  airlines: string[] | null;
  departure_city: string | null;
  min_passengers: number | null;

  // Provider (requeridos en detail)
  internal_pkg_id: string | null;
  provider_pkg_id: string | null;
  provider_ui: string | null;

    // Notas - requeridas en detalle (o null si no hay)
  notes: Note[] | null;
}

// ── Tabs ──
export type TabType = "itinerary" | "optionals" | "hotels" | "prices";

// ── Content types ──
export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  optional?: string | null;
}

export interface HotelEntry {
  country: string;
  city: string;
    hotels: string[];
  type?: string;
}
