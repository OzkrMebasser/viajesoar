import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/app/i18n/routing';
import { getMessages } from 'next-intl/server';

export default getRequestConfig(async ({ locale }: { locale?: string }) => {
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale; // fallback seguro
  }

  const messages = await getMessages();

  return {
    locale,
    messages,
  };
});