import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";
import { getActivityBySlug } from "@/lib/data/destinations/activities";
import { getPackageBySlug } from "@/lib/data/packages/packages";
import ActivityDestination from "@/components/Activity/ActivityDestinations";

export const revalidate = 3600;

export default async function PackageActivityPage({
  params,
}: {
  params: Promise<{ pkgSlug: string; activitySlug: string }>;
}) {
  const { pkgSlug, activitySlug } = await params;
  const locale = (await getLocale()) as Locale;

  const [activity, pkg] = await Promise.all([
    getActivityBySlug(activitySlug, locale),
    getPackageBySlug(pkgSlug, locale),
  ]);

  if (!activity || !pkg) notFound();

  return (
    <ActivityDestination
      locale={locale}
      regionSlug=""
      cityName=""
      countryName={pkg.visited_countries?.[0]?.name ?? ""}
      country={pkg.visited_countries?.[0] as any}
      city={pkg.visited_cities?.[0] as any}
      activity={activity}
      backHref={`/${locale}/${locale === "es" ? "paquetes" : "packages"}/${pkgSlug}`}
    />
  );
}