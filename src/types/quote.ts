export type Locale = "es" | "en";
export const t = (locale: Locale, es: string, en: string) =>
  locale === "es" ? es : en;

export type QuoteStatus = "idle" | "loading" | "success" | "error";

export interface Departure {
  id: string;
  date_start: string;
  date_end: string;
  departure_city: string;
  price_base: number;
  price_taxes: number;
  price_supplement?: number | null;
  availability?: "available" | "last_spots" | "sold_out";
}

export interface QuoteFormProps {
  locale: Locale;
  packageName: string;
  internalPkgId?: string | null;
  packageSlug?: string;
  priceFrom?: number | null;
  priceSingle?: number | null;
  departures?: Departure[];
}

export interface QuoteFormState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  agency: string;
  country: string;
  state: string;
  municipality: string;
  adults: number;
  children: number;
  terms: boolean;
  newsletter: boolean;
  message: string;
  travel_date: string;
 trip_purpose: string,
}

export const EMPTY_FORM: QuoteFormState = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  whatsapp: "",
  agency: "",
  country: "",
  state: "",
  municipality: "",
   travel_date: "",
  adults: 0,
  children: 0,
  terms: false,
  newsletter: false,
  message: "",
  trip_purpose: "",
};

export const PRIORITY_CODES = ["MX", "US", "CA"];


export function formatDate(dateStr: string, locale: Locale) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString(
    locale === "es" ? "es-MX" : "en-US",
    { day: "numeric", month: "long", year: "numeric" },
  );
}

