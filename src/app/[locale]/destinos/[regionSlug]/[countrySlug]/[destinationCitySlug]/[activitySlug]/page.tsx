import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";
import { getCountryBySlug } from "@/lib/data/destinations/regions";
import { getCityBySlug, getActivitiesByDestination } from "@/lib/data/destinations/cities";
import { getActivityBySlug } from "@/lib/data/destinations/activities";
import ActivityDestination from "@/components/Activity/ActivityDestinations";

export const revalidate = 3600;

export default async function ActivityPage({
  params,
}: {
  params: Promise<{
    regionSlug: string;
    countrySlug: string;
    destinationCitySlug: string;
    activitySlug: string;
  }>;
}) {
  const { regionSlug, countrySlug, destinationCitySlug, activitySlug } = await params;
  const locale = (await getLocale()) as Locale;

  const [activity, city, country] = await Promise.all([
    getActivityBySlug(activitySlug, locale),
    getCityBySlug(destinationCitySlug, locale),
    getCountryBySlug(countrySlug, locale),
  ]);

  if (!activity || !city || !country) notFound();
  // if (activity.destination_id !== city.id) notFound();

  return (
    <ActivityDestination
      locale={locale}
      regionSlug={regionSlug}
      cityName={city.name}
      countryName={country.name}
      country={country}
      city={city}
      activity={activity}
    />
  );
}