import AuthForm from "@/components/AuthForm";
import { useTranslations } from "next-intl";

export default function LoginPage() {
    const t = useTranslations("Navigation");
  
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <AuthForm />
    </main>
  );
}
