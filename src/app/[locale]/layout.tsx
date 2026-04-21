import { NextIntlClientProvider } from "next-intl";
// import WorldMapLoader from "@/components/WorldMapLoader";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/app/i18n/routing";
import AirplaneCursor from "@/components/Airplane/AirplaneCursor";

import Footer from "@/components/Footer";
import { FavoritesProvider } from "@/lib/context/FavoritesProvider";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import WhatsAppChat from "@/components/WhatsAppChat";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getNavRegions } from "@/lib/data/destinations";
// import type { NavRegion } from "@/lib/data/destinations";
import NavMenu from "@/components/Navigation/NavMenu";

import type { Locale } from "@/types/locale";


  
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
const { locale } = await params;

if (!routing.locales.includes(locale as any)) {
  notFound();
}

const navRegions = await getNavRegions(locale as Locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <FavoritesProvider>
        <ThemeProvider>
          <NavMenu  navRegions={navRegions} />
          <AirplaneCursor />
          {children}
          <Footer />
          <WhatsAppChat />
        </ThemeProvider>
      </FavoritesProvider>
    </NextIntlClientProvider>
  );
}