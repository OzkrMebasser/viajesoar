
import ContactPage from "@/components/Contact/ContactPage";
import type { Locale } from "@/types/locale";
import { getLocale } from "next-intl/server";

export default async function Contact() {
  const locale = await getLocale() as Locale;
  return <ContactPage locale={locale} />;
}