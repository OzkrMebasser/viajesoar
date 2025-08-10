import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/app/i18n/routing';


export default getRequestConfig(async ({ locale }) => {
  if (!routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale; // Fallback
  }

  return {
    locale, // 👈 IMPORTANTE: incluirlo siempre
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
