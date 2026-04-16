
export interface Offer {
  id: string;
  locale: string;
  package_id: string | null;

  // Contenido
  title: string;
  subtitle: string | null;
  description: string | null;
  badge_label: string | null;
  cover_image: string | null;

  // Precios
  original_price: number | null;
  offer_price: number | null;
  currency: string;
  discount_percent: number | null;

  // Vigencia
  valid_from: string | null;
  valid_until: string | null;

  // Display
  destination_label: string | null;
  duration_label: string | null;

  // Control
  is_active: boolean;
  is_featured: boolean;
  sort_order: number | null;

  created_at: string;
  updated_at: string | null;

  // Relación hydratada (opcional)
  package?: { slug: string } | null;
}