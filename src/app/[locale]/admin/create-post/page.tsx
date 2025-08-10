"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CreatePostPage() {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAccess = async () => {
      console.log("🔍 Verificando acceso...");

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          console.log("❌ No hay usuario autenticado:", error);
          router.push("/login");
          setLoading(false);
          return;
        }

        console.log("✅ Usuario encontrado:", user.id);
        console.log("🔑 Session:", await supabase.auth.getSession());

        // Verificar que Supabase esté usando la sesión correcta
        const { data: testAuth } = await supabase.auth.getUser();
        console.log("🧪 Test auth:", testAuth);

        let { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        console.log("👤 Perfil:", profile);
        console.log("🔍 Profile error:", profileError);

        // Si no existe el perfil, crearlo con role 'user' por defecto
        if (profileError && profileError.code === 'PGRST116') {
          console.log("📝 Creando perfil para nuevo usuario...");
          
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([
              { 
                id: user.id,
                role: 'user' // Por defecto, rol 'user' - cambiar manualmente a 'admin' si necesario
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error("❌ Error creando perfil:", createError);
            router.push("/not-authorized");
            setLoading(false);
            return;
          }

          profile = newProfile;
          console.log("✅ Perfil creado:", profile);
        }

        console.log("👑 Profile role:", profile?.role);

        if (!profile || profile.role !== "admin") {
          console.log("❌ Acceso denegado - no es admin");
          router.push("/not-authorized");
          setLoading(false);
          return;
        }

        console.log("✅ Acceso permitido - usuario es admin");
        setAllowed(true);
        setLoading(false);
      } catch (err) {
        console.error("💥 Error en verificación:", err);
        router.push("/login");
        setLoading(false);
      }
    };

    verifyAccess();
  }, [router]);

  // CORREGIDO: Mostrar loading mientras está cargando
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-700">Verificando acceso...</p>
      </div>
    );
  }

  // Si no está permitido, no mostrar nada (ya se redirigió)
  if (!allowed) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Crear nuevo post ✍️</h1>
      {/* Aquí irá el formulario para crear posts */}
      <p className="text-gray-600">Formulario próximamente...</p>
    </div>
  );
}