// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../app/[locale]/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Aquí podrías recibir locale como prop si quieres o manejarlo con middleware/context
export default function RootLayout({
  children,
  params, // Puedes recibir params si usas Next 13+ con app router
}: {
  children: React.ReactNode;
  params?: { locale?: string };
}) {
  const locale = params?.locale || 'es'; // fallback

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
