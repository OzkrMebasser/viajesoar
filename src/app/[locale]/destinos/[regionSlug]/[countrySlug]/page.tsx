import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";
import { getCountryBySlug, getRegionBySlug  } from "@/lib/data/destinations/regions";
import { getDestinationsByCountry } from "@/lib/data/destinations/cities";
import CountryDestination from "@/components/Country/CountryDestination";



export default async function CountryPage({
  params,
}: {
  params: Promise<{ regionSlug: string; countrySlug: string }>;
}) {
  const { regionSlug, countrySlug } = await params;
  const locale = (await getLocale()) as Locale;

  const [country, region] = await Promise.all([
    getCountryBySlug(countrySlug, locale),
    getRegionBySlug(regionSlug, locale),
  ]);

  if (!country || !region) notFound();

  const cities = await getDestinationsByCountry(country.id, locale);
  // console.log(cities)

  return (
    <CountryDestination
      locale={locale}
      regionSlug={regionSlug}
      regionName={region.name}  
      country={country}
      cities={cities}
    />
  );
}