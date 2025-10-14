import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/app/i18n/routing";
import AirplaneCursor from "@/components/Airplane/AirplaneCursor";
import Navigation from "@/components/Navigation";
import { FavoritesProvider } from "@/lib/context/FavoritesProvider";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // console.log(locale);



  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // console.log(`la ruta es ${routing.pathnames["/favorites"][locale as "es" | "en"]}`);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <FavoritesProvider>
            <Navigation />
            <AirplaneCursor />
            {children}
          </FavoritesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
