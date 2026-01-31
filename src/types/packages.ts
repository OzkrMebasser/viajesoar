export interface LocationRef {
  id: string;
  name: string;
  slug: string;
}

export interface Package {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  images: string[];
  duration: string | null;
  price_from: number | null;
  currency: string;
  visited_cities: LocationRef[];
  visited_countries: LocationRef[];
}
