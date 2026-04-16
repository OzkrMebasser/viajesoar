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
    hydrateOptionals(optionalIds, locale), 
  ]);

  return (
    <PackageInfoFull
      pkg={pkg}
      locale={locale} 
      similarPackages={similarPackages}
      optionals={optionals} 
    />
  );
}
// import { notFound } from "next/navigation";
// import { getPackageBySlug } from "@/lib/data/packages/packages";
// import PackageInfoFull from "@/components/Packages/PackageInfoFull";
// import type { Locale } from "@/types/locale";

// export default async function Page({
//   params,
// }: {
//   params: Promise<{ pkgSlug: string; locale: Locale }>;
// }) {
//   const { pkgSlug, locale } = await params;

//   const pkg = await getPackageBySlug(pkgSlug, locale);

//   if (!pkg) notFound();

//   return <PackageInfoFull pkg={pkg} locale="en"/>;
// }

