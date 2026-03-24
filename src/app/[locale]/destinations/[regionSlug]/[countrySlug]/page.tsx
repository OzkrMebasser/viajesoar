import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";
import { getCountryBySlug } from "@/lib/data/destinations/regions";
import { getDestinationsByCountry } from "@/lib/data/destinations/cities";
import CountryDestination from "@/components/Country/CountryDestination";

export default async function CountryPage({
  params,
}: {
  params: Promise<{ regionSlug: string; countrySlug: string }>;
}) {
  const { regionSlug, countrySlug } = await params;
  const locale = (await getLocale()) as Locale;

  const country = await getCountryBySlug(countrySlug, locale);
  if (!country) notFound();

  const cities = await getDestinationsByCountry(country.id, locale);

  return (
    <CountryDestination
      locale={locale}
      regionSlug={regionSlug}
      country={country}
      cities={cities}
    />
  );
}