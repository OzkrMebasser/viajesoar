import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/app/i18n/routing";
import AirplaneCursor from "@/components/Airplane/AirplaneCursor";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FavoritesProvider } from "@/lib/context/FavoritesProvider";
import WhatsAppChat from "@/components/WhatsAppChat";

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
      <body className="bg-gradient-to-b from-black via-gray-950 to-black">
        <NextIntlClientProvider messages={messages}>
          <FavoritesProvider>
            <Navigation />
            <AirplaneCursor />
            {children}
            <Footer />
          </FavoritesProvider>
          <WhatsAppChat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
