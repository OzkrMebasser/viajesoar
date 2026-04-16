

import TourList from "@/components/Activity/Tours/TourList";
import { getAllActivities } from "@/lib/data/destinations/activities";
import type { Locale } from "@/types/locale";

export default async function ToursPage(props: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;

  const data = await getAllActivities(params.locale, page);

  return (
    <TourList
      locale={params.locale}
      data={data.data}
      page={data.page}
      totalPages={data.totalPages}
      total={data.total}
    />
  );
}