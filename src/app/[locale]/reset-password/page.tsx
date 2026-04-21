import ResetPasswordPage from "@/components/Auth/ResetPasswordPage";

export default function Page({ params }: { params: { locale: "es" | "en" } }) {
  return <ResetPasswordPage locale={params.locale} />;
}