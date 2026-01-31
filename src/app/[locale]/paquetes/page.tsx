// Page to display list of packages in Spanish locale
import PackageList from "@/components/Packages/PackageList";
import { getPackages } from "@/lib/data/packages/packages";
import type { Locale } from "@/types/locale";

export default async function Page(props: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;

  const data = await getPackages(params.locale, page);

  return <PackageList locale={params.locale} {...data} />;
}
