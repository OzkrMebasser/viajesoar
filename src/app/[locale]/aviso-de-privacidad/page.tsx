


import PrivacyPage from "@/components/Legal/PrivacyPage";
import TermsPage from "@/components/Legal/TermsPage";
import type { Locale } from "@/types/locale";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <PrivacyPage locale={locale} />;
}