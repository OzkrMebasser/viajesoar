
import FaqSection from "@/components/Legal/FaqSection";
import type { Locale } from "@/types/locale";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <FaqSection locale={locale} />;
}