import { notFound } from "next/navigation";
import { getPackageBySlug, getSimilarPackages } from "@/lib/data/packages/packages";
import { hydrateOptionals } from "@/lib/data/destinations/activities"
import PackageInfoFull from "@/components/Packages/Detail/PackageInfoFull";
import type { Locale } from "@/types/locale";

export default async function Page({
  params,
}: {
  params: Promise<{ pkgSlug: string; locale: Locale }>;
}) {
  const { pkgSlug, locale } = await params;

  const pkg = await getPackageBySlug(pkgSlug, locale);

  if (!pkg) notFound();

  const optionalIds: string[] = Array.isArray(pkg.optional_activities)
    ? pkg.optional_activities
    : [];

  const [similarPackages, optionals] = await Promise.all([
    getSimilarPackages(locale, pkg.region_id ?? null, pkgSlug, 3),
    hydrateOptionals(optionalIds, locale), // ← paralelo con similarPackages
  ]);

  return (
    <PackageInfoFull
      pkg={pkg}
      locale={locale} // ← también fix: estabas hardcodeando "en"
      similarPackages={similarPackages}
      optionals={optionals} // ← pasar
    />
  );
}