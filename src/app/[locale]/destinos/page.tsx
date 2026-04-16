import AllRegions from "@/components/Regions/AllRegions";
import { getAllRegions } from "@/lib/data/destinations/regions";
import type { Locale } from "@/types/locale";
import { getLocale } from "next-intl/server";

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function AllDestinationsPage(props: Props) {

  const locale = (await getLocale()) as Locale;
  const regions = await getAllRegions(locale);

  return (
    <main>
      <AllRegions locale={locale} regions={regions} />
    </main>
  );
}


