// app/[locale]/destinos/[regionSlug]/page.tsx
import RegionDestination from "@/components/Regions/RegionDestination";
import { getRegionBySlug, getCountriesByRegion, getAllRegions } from "@/lib/data/destinations/regions";

import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ locale: Locale; regionSlug: string }>;
}) {
  const { regionSlug } = await params;
  const locale = (await getLocale()) as Locale;

  const region = await getRegionBySlug(regionSlug, locale);
  if (!region) notFound();

  const countries = await getCountriesByRegion(region.id, locale);

  return (
    <RegionDestination
      locale={locale}
      region={region}
      countries={countries}
    />
  );
}