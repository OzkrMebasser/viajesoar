// src/app/[locale]/ofertas/page.tsx
import { getOffers } from "@/lib/data/offers/offers";
import type { Locale } from "@/types/locale";
import type { Metadata } from "next";
import OffersPage from "@/components/Offers/OffersPage";

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  return {
    title: locale === "es" ? "Ofertas y Promociones — ViajeSoar" : "Deals & Promotions — ViajeSoar",
    description: locale === "es"
      ? "Descubre nuestras mejores ofertas y promociones en paquetes de viaje."
      : "Discover our best deals and promotions on travel packages.",
  };
}

export default async function Page(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params;
  const offers = await getOffers(locale);

  return <OffersPage locale={locale} offers={offers} />;
}