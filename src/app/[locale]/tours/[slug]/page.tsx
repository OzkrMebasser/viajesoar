import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";
import {
  getActivityBySlugWithLocation,
  getSimilarTours,
} from "@/lib/data/destinations/activities";
import ActivityDestination from "@/components/Activity/ActivityDestinations";

export const revalidate = 3600;

export default async function TourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;

  const activity = await getActivityBySlugWithLocation(slug, locale);
  if (!activity) notFound();

  const similarTours = await getSimilarTours(
    locale,
    activity.destination_id ?? null,
    slug,
    6,
  );

  return (
    <ActivityDestination
      locale={locale}
      regionSlug=""
      cityName={activity.city_name ?? ""}
      countryName={activity.country_name ?? ""}
      activity={activity}
      similarTours={similarTours}
    />
  );
}