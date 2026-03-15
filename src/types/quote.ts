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

}

export const EMPTY_FORM: QuoteFormState = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  agency: "",
  country: "",
  state: "",
  municipality: "",
   travel_date: "",
  adults: 1,
  children: 0,
  terms: false,
  newsletter: false,
  message: "",
};

export const PRIORITY_CODES = ["MX", "US", "CA"];

export const inputClass = `
  w-full bg-(--bg-tertiary)/60 border border-[var(--border)]/30
  text-[var(--text)] text-sm
  rounded-sm px-3 py-2
  placeholder:text-[var(--text)]/25
  focus:outline-none focus:border-[var(--accent)]/60
  transition-colors duration-150
`;

export function formatDate(dateStr: string, locale: Locale) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString(
    locale === "es" ? "es-MX" : "en-US",
    { day: "numeric", month: "long", year: "numeric" },
  );
}