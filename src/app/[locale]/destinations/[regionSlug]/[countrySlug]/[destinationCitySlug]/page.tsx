import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";
import { getCountryBySlug } from "@/lib/data/destinations/regions";
import { getCityBySlug, getActivitiesByDestination } from "@/lib/data/destinations/cities";
import CityDestination from "@/components/City/CityDestination";

export default async function CityDestinationPage({
  params,
}: {
  params: Promise<{ regionSlug: string; countrySlug: string; destinationCitySlug: string }>;
}) {
  const { regionSlug, countrySlug, destinationCitySlug } = await params;
  const locale = (await getLocale()) as Locale;

  const [city, country] = await Promise.all([
    getCityBySlug(destinationCitySlug, locale),
    getCountryBySlug(countrySlug, locale),
  ]);

  if (!city || !country) notFound();

  // Validar jerarquía
  if (city.country_id !== country.id) notFound();

  const activities = await getActivitiesByDestination(city.id, locale);

  return (
    <CityDestination
      locale={locale}
      countryName={country.name}
      regionSlug={regionSlug}
      country={country}
      city={city}
      activities={activities}
    />
  );
}