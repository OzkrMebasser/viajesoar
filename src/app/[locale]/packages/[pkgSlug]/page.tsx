
import { notFound } from "next/navigation";
import { getPackageBySlug } from "@/lib/data/packages/packages";
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

  return <PackageInfoFull pkg={pkg} locale="en"/>;
}

