"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuth = async () => {
      // Intercambiar el código por la sesión (Supabase v2)
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

      if (error) {
        console.error("❌ Error en OAuth callback:", error.message);
        return;
      }

      console.log("✅ Sesión iniciada:", data.session);

      // Redirige al home o dashboard
      router.push("/");
    };

    handleOAuth();
  }, [router]);

  return <p className="text-center mt-10">Procesando login...</p>;
}
