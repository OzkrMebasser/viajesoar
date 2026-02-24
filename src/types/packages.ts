export interface LocationRef {
  id: string;
  name: string;
  slug: string;
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
  currency: string;
  visited_cities: LocationRef[];
  visited_countries: LocationRef[];

  // ── Campos opcionales — disponibles en listing y detail ──
  days?: number | null;
  nights?: number | null;
  includes_flight?: boolean | null;
  min_passengers?: number | null;
  internal_pkg_id?: string | null;
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
  hotel: string;
  type?: string;
}