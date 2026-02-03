import Destinations from "@/components/Destinations";
import { getDestinationsPaginated } from "@/lib/data/destinations";
import DestinationsClient from "@/components/Destinations/DestinationsClient";
import type { Locale } from "@/types/locale";
import { getLocale } from "next-intl/server";

interface Props {
  searchParams: { page?: string };
   params: Promise<{ locale: Locale }>;
}

export default async function AllDestinationsPage(props: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string }>;
}) 
 {
  const locale = (await getLocale()) as Locale;

  const params = await props.params;
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;

  const data = await getDestinationsPaginated(params.locale, page);
  console.log("Toda la data", data.total)
  
//  console.log(`pagina:`, page)
  return (
    <main>
      <Destinations
        destinations={data.data}
        page={data.page}
        totalPages={data.totalPages}
        locale={locale}
        total={data.total}
      />
    </main>
  );
}
