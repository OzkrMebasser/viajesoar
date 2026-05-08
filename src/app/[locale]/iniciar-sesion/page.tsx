import AuthForm from "@/components/Auth/AuthForm";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/types/locale";

export default async function LoginPage() {
  const locale = await getLocale() as Locale;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm locale={locale} />
    </main>
  );
}