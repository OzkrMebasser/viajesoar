// app/[locale]/favoritos/page.tsx
import FavoritesPage from "@/components/FavoritesPage";
import type { Locale } from "@/types/locale";

export default async function FavoriteDestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <FavoritesPage locale={locale as Locale} />;
}