import { notFound } from "next/navigation";
import { getPackageBySlug, getSimilarPackages } from "@/lib/data/packages/packages";
import PackageInfoFull from "@/components/Packages/PackageInfoFull";
import type { Locale } from "@/types/locale";

export default async function Page({
  params,
}: {
  params: Promise<{ pkgSlug: string; locale: Locale }>;
}) {
  const { pkgSlug, locale } = await params;

  const pkg = await getPackageBySlug(pkgSlug, locale);

  if (!pkg) notFound();

  const similarPackages = await getSimilarPackages(
    locale,
    pkg.region_id ?? null,
    pkgSlug,
    3
  );

  // console.log("📦 Similar packages response:", similarPackages);


  return <PackageInfoFull pkg={pkg} locale="es" similarPackages={similarPackages} />;
}