import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/app/i18n/routing";
import AirplaneCursor from "@/components/Airplane/AirplaneCursor";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer";
import { FavoritesProvider } from "@/lib/context/FavoritesProvider";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import WhatsAppChat from "@/components/WhatsAppChat";

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

  const messages = await getMessages();

  return (
  <html lang={locale} suppressHydrationWarning>
    <head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              var t = localStorage.getItem('theme');
              if (t === 'light' || t === 'vibrant' || t === 'dark') {
                document.documentElement.setAttribute('data-theme', t);
              }
            } catch(e) {}
          `,
        }}
      />
    </head>
  <body>
    <FavoritesProvider>
    <ThemeProvider>
      <NextIntlClientProvider messages={messages}>
        {/* <FavoritesProvider> */}
          <Navigation />
          <AirplaneCursor />
          {children}
          <Footer />
        {/* </FavoritesProvider> */}
        <WhatsAppChat />
      </NextIntlClientProvider>
    </ThemeProvider>
    </FavoritesProvider>
  </body>
</html>

  );
}
