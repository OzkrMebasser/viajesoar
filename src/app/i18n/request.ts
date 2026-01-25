import {hasLocale} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  // console.log('Requested locale:', requested);
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

    // console.log('Resolved locale:', locale);
  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default
  };
});