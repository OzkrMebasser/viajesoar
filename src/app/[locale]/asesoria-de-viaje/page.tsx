import AsesoriaPage from "@/components/TravelConsultations/AsesoriaPage";
import type { Locale } from "@/types/locale";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <AsesoriaPage locale={locale} />;
}