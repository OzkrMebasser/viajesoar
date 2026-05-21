

import AboutPage from "@/components/About/AboutPage";
import type { Locale } from "@/types/locale";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <AboutPage locale={locale} />;
}